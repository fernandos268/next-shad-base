import { AuthPageRoutes, PrivatePageRotues } from '@/lib/static'
import { verifyAuth0Token } from '@/lib/verifyAuth0Token'
import { NextResponse, type NextRequest } from 'next/server'
import { auth0Client } from "@/lib/auth0";


export default async function auth0Middleware(request: NextRequest) {
  // Check if there is a session from Social connection.
  const socialAuthSession = await auth0Client.getSession()

  let socialAuthIdToken = ''

  if (socialAuthSession?.user) {
    const { tokenSet } = socialAuthSession
    socialAuthIdToken = tokenSet?.idToken as string
  }

  const nextUrl = request.nextUrl.pathname
  const access_token = request.cookies.get("access_token")?.value || ''
  const url = request.nextUrl.clone()

  // Check if which token is available and store in variable
  const auth_token = socialAuthIdToken || access_token

  // Identify auth session cookie key
  const cookie_key = socialAuthIdToken ? '__session' : 'access_token'

  // Verify token
  const verifyTokenResult = auth_token
    ? await verifyAuth0Token(auth_token)
    : { isAuthenticated: false }

  const isTokenValid = verifyTokenResult.isAuthenticated

  // If accessing private route without token
  if (PrivatePageRotues.includes(nextUrl)) {
    if (!auth_token) {
      url.pathname = '/sign-in'
      return NextResponse.redirect(url)
    }

    if (!isTokenValid) {
      url.pathname = '/sign-in'
      const response = NextResponse.redirect(url)
      response.cookies.delete(cookie_key)
      return response
    }
  }

  // If accessing auth page (sign-in/signup) but already logged in
  if (AuthPageRoutes.includes(nextUrl) && isTokenValid) {
    url.pathname = '/profile'
    return NextResponse.redirect(url)
  }

  // if access_token exists but invalid, clear cookie
  if (auth_token && !isTokenValid) {
    const response = NextResponse.next()
    response.cookies.delete(cookie_key)
    return response
  }

  return NextResponse.next()
}
