import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    if ((pathName.startsWith('/secretary') || pathName.startsWith('/director')) && !request.cookies.has('token')) {
        return NextResponse.redirect(new URL('/user', request.nextUrl));
    }
}

export const config = {
    matcher: [
        '/director',
        '/secretary',
        '/secretary/:path*',
        '/director/:path*',
    ]
}