import {NextRequest, NextResponse} from 'next/server';
import Cookies from "js-cookie";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    if(path === "/" && !Cookies.get("user")) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }
}