import { AuthPageRoutes, PrivatePageRotues } from '@/lib/static';
import { verifyAuth0Token } from '@/lib/verifyAuth0Token';
import { NextResponse, type NextRequest } from 'next/server';

export default async function auth0Middleware(request: NextRequest) {
  const nextUrl = request.nextUrl.pathname
  const access_token = request.cookies.get("access_token")?.value || '';
  const id_token = request.cookies.get("id_token")?.value || '';
  const url = request.nextUrl.clone()

  const [verifyTokenResult, verifyUserResult] = await Promise.all([
    verifyAuth0Token(access_token),
    verifyAuth0Token(id_token)
  ])

  const areTokensValid = verifyTokenResult.isValid && verifyUserResult.isValid

  if (PrivatePageRotues.includes(nextUrl)) {
    if (!access_token || !id_token) {
      url.pathname = '/sign-in'
      return NextResponse.redirect(url)
    }

    if (!areTokensValid) {
      url.pathname = '/sign-in'
      NextResponse.next().cookies.delete('access_token')
      NextResponse.next().cookies.delete('id_token')
      return NextResponse.redirect(url)
    }
  }

  if (AuthPageRoutes.includes(nextUrl) && access_token && id_token) {
    if (areTokensValid) {
      url.pathname = '/profile'
      return NextResponse.redirect(url)
    } else {
      NextResponse.next().cookies.delete('access_token');
      NextResponse.next().cookies.delete('id_token');
    }
  }


  return NextResponse.next()
}