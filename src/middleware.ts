import {NextRequest, NextResponse} from 'next/server';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const {cookies} = request;

    const token = cookies.get("user");

    if(!token) {

    }

}