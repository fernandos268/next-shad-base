import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { ManagementClient, AuthenticationClient } from 'auth0'

export const managementClient = new ManagementClient({
    domain: process.env.AUTH0_DOMAIN!,
    clientId: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
});

export const authenticationClient = new AuthenticationClient({
    domain: process.env.AUTH0_DOMAIN!,
    clientId: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
});


export const auth0Client = new Auth0Client();