import jwt, {
  type JwtHeader,
  type VerifyErrors,
  type VerifyOptions,
  type JwtPayload,
} from 'jsonwebtoken';
import jwksClient, { JwksClient } from 'jwks-rsa';
import { managementClient } from '@/lib/auth0';

export interface IAuth0BasePayload extends JwtPayload {
  iss: string; // Issuer
  sub: string; // Subject (user ID)
  aud: string | string[]; // Audience
  exp: number; // Expiry (Unix timestamp)
  iat?: number; // Issued at
  email?: string;
  scope?: string;
}


export type TTokenType = 'id' | 'access';

interface IResultType { payload: IAuth0BasePayload; type: TTokenType }

const domain = process.env.AUTH0_DOMAIN!;
const clientId = process.env.AUTH0_CLIENT_ID!;
const apiAudience = process.env.AUTH0_AUDIENCE!;

const client: JwksClient = jwksClient({
  jwksUri: `https://${domain}/.well-known/jwks.json`,
});


function getKey(
  header: JwtHeader,
  callback: (err: Error | null, key?: string) => void
): void {
  if (!header.kid) {
    return callback(new Error('Missing "kid" in token header'));
  }

  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key?.getPublicKey();
    if (!signingKey) return callback(new Error('Signing key not found'));
    callback(null, signingKey);
  });
}


// Detect if token is likely an ID or Access token
function detectTokenType(payload: IAuth0BasePayload): TTokenType {
  const aud = payload.aud;

  if (Array.isArray(aud)) {
    if (aud.includes(apiAudience)) return 'access';
    if (aud.includes(clientId)) return 'id';
  } else {
    if (aud === apiAudience) return 'access';
    if (aud === clientId) return 'id';
  }

  return 'access'
}

// Verify an Auth0-issued token (ID or Access)
export async function verifyAuth0Token(
  token: string
): Promise<{ isAuthenticated: boolean, error?: unknown, result?: IResultType }> {

  try {
    const result: IResultType = await new Promise((resolve, reject) => {
      // Decode the JWT token
      const decoded = jwt.decode(token, { complete: true });

      if (!decoded || typeof decoded !== 'object' || !('payload' in decoded)) {
        return reject(new Error('Invalid JWT format'));
      }

      const payload = decoded.payload as IAuth0BasePayload;
      const tokenType = detectTokenType(payload);
      const expectedAudience = tokenType === 'id' ? clientId : apiAudience;

      const verifyOptions: VerifyOptions = {
        audience: expectedAudience,
        issuer: `https://${domain}/`,
        algorithms: ['RS256'],
      };

      jwt.verify(
        token,
        getKey,
        verifyOptions,
        (err: VerifyErrors | null, verifiedPayload) => {
          if (err) return reject(err);
          const verified = verifiedPayload as IAuth0BasePayload;
          resolve({ payload: verified, type: tokenType });
        }
      );
    });


    // Manually check the user validity using Management API Client
    if (result && result.payload.sub) {
      const user = await managementClient.users.get(result.payload.sub)
      let user_auth_error = ''

      if (!user) {
        user_auth_error = 'User account does not exist.'
      }

      if (user.blocked) {
        user_auth_error = 'User account is blocked, please contact administrator.'
      }

      if (user_auth_error) {
        return {
          isAuthenticated: false,
          error: user_auth_error
        }
      }
    }

    return {
      isAuthenticated: true,
      result
    }
  } catch (error) {
    console.log("%c ERROR: verifyAuth0Token", "color:#7f2b82", error);
    return {
      isAuthenticated: false,
      error: 'Invalid access token.'
    }
  }
}
