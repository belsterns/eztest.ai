import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const authRoutes = ["/login", "/register"];
const frontendUnprotectedRoutes = ["/about"];
const backendUnprotectedRoutes: string[] = []; 

const defaultUnAuthorizedRoute = "/login";
const defaultAuthorizedRoute = "/workspaces";

const secret = process.env.AUTH_SECRET;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isApiPublicRoute = backendUnprotectedRoutes.includes(pathname)
    if(isApiPublicRoute ) {
        return NextResponse.next();
    }

    const isPublicRoute = frontendUnprotectedRoutes.includes(pathname)
    if(isPublicRoute) {
        return NextResponse.next();
    }

    const token = await getToken({ req: request, secret });

    if(authRoutes.includes(pathname) && token){
       return NextResponse.redirect(new URL(defaultAuthorizedRoute, request.url));
    }

    if(pathname.includes('/api') && !token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    } 

    if(!pathname.includes('/api') && !token) {
        return NextResponse.redirect(new URL(defaultUnAuthorizedRoute, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|.*\\.png$).*)",
    ], // Excludes static files and images, but includes API except /api/auth
};
