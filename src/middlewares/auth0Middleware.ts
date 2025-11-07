import { NextResponse, type NextRequest } from 'next/server'
import { auth0Client } from "@/lib/auth0";
import { PrivatePageRotues, AuthPageRoutes, defaultPostAuthRedirectUrl } from '@/lib/static'
import { verifyAuth0Token } from '@/lib/verifyAuth0Token';

export default async function auth0Middleware(request: NextRequest) {
    const response = await auth0Client.middleware(request);
    const nextUrl = request.nextUrl.pathname
    const access_token = request.cookies.get("access_token")?.value;
    const url = request.nextUrl.clone()

    if (PrivatePageRotues.includes(nextUrl)) {

        if (!access_token) {
            url.pathname = '/sign-in'
            return NextResponse.redirect(url)
        }

        const verifyTokenResult = await verifyAuth0Token(access_token);
        if (!verifyTokenResult.isValid) {
            url.pathname = '/sign-in'
            return NextResponse.redirect(url)
        }
    }

    if (AuthPageRoutes.includes(nextUrl) && access_token) {
        const verifyTokenResult = await verifyAuth0Token(access_token);
        if (verifyTokenResult.isValid) {
            url.pathname = defaultPostAuthRedirectUrl
            return NextResponse.redirect(url)
        }
    }


    return response
}