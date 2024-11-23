import { getCookie } from "cookies-next";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const cookie = getCookie("token");
    const pathName = request.nextUrl.pathname;
    if ((pathName.startsWith('/secretary') || pathName.startsWith('/director')) && !cookie) {
        console.log('Redirecting to login');
        return NextResponse.redirect(new URL('/user', request.nextUrl));
    }
}

export const config = {
    matcher: [
        '/director',
        '/secretary',
        '/secretary/:path',
        '/director/:path',
    ]
}