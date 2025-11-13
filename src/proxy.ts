import type { NextRequest } from "next/server";
import auth0Middleware from '@/middlewares/auth0Middleware'
import { auth0Client } from "@/lib/auth0";

const corsHeaders = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
}

export async function proxy(request: NextRequest) {
    const auth0ClientResponse = await auth0Client.middleware(request);

    if (request.nextUrl.pathname.startsWith("/auth")) {
        Object.entries(corsHeaders).forEach(([header, value]) => {
            auth0ClientResponse.headers.set(header, value)
        });

        return auth0ClientResponse;
    }

    const authResponse = await auth0Middleware(request)
    return authResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json).*)",
        "/api/:path*"
    ]
};