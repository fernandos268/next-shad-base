import type { NextRequest } from "next/server";
import auth0Middleware from '@/middlewares/auth0Middleware'
import { auth0Client } from "@/lib/auth0";

export async function proxy(request: NextRequest) {
    await auth0Client.middleware(request);

    const auth0response = await auth0Middleware(request)
    return auth0response
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
    ]
};