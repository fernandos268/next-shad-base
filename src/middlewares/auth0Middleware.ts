import { NextResponse, type NextRequest } from 'next/server'
import { auth0Client } from "@/lib/auth0";
import { cookies } from 'next/headers'
import { PrivatePageRotues } from '@/lib/static'

export default async function auth0Middleware(request: NextRequest) {

    const response = await auth0Client.middleware(request);

    const cookieStore = await cookies()


    const nextUrl = request.nextUrl.pathname

    // const urlObj = request.nextUrl.clone()
    const access_token = request.cookies.get("access_token")?.value;

    if (PrivatePageRotues.includes(nextUrl)) {
        console.log("%c Line:17 🎂 access_token", "color:#b03734", access_token);
        console.log("%c Line:19 🍉 nextUrl", "color:#ea7e5c", nextUrl);

        if (!access_token) {
            const url = request.nextUrl.clone()
            url.pathname = '/sign-in'
            return NextResponse.redirect(url)
        }

        // TODO: validate if session is still valid
        // implement checking logic here...
    }


    return response
}