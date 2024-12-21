import {NextRequest, NextResponse} from 'next/server';
import { auth } from "@/lib/firebase/config";
import {onAuthStateChanged} from "firebase/auth";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const {cookies} = request;

    const token = cookies.get("user");

    if(!token) {

        if(path === "/") {
            return NextResponse.redirect(new URL("/login", request.url));
        }

    }

}