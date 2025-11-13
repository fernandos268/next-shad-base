import { AuthPageRoutes, PrivatePageRotues } from '@/lib/static'
import { verifyAuth0Token } from '@/lib/verifyAuth0Token'
import { NextResponse, type NextRequest } from 'next/server'

export default async function auth0Middleware(request: NextRequest) {
  const nextUrl = request.nextUrl.pathname
  const access_token = request.cookies.get("access_token")?.value || ''
  const url = request.nextUrl.clone()

  const verifyTokenResult = access_token
    ? await verifyAuth0Token(access_token)
    : { isAuthenticated: false }

  const isTokenValid = verifyTokenResult.isAuthenticated

  // If accessing private route without token
  if (PrivatePageRotues.includes(nextUrl)) {
    if (!access_token) {
      url.pathname = '/sign-in'
      return NextResponse.redirect(url)
    }

    if (!isTokenValid) {
      url.pathname = '/sign-in'
      const response = NextResponse.redirect(url)
      response.cookies.delete('access_token')
      return response
    }
  }

  // If accessing auth page (sign-in/signup) but already logged in
  if (AuthPageRoutes.includes(nextUrl) && isTokenValid) {
    url.pathname = '/profile'
    return NextResponse.redirect(url)
  }

  // if access_token exists but invalid, clear cookie
  if (access_token && !isTokenValid && verifyTokenResult.error) {
    const response = NextResponse.next()
    response.cookies.delete('access_token')
    return response
  }

  return NextResponse.next()
}
