import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const frontEndPublicRoutes = ["/login", "/register"];
const backEndPublicRoutes = ["/api/v1/auth/sign-up"];
const unprotectedRoutes = ["/about"]; 

const defaultUnAuthorizedRoute = "/login";
const defaultAuthorizedRoute = "/workspaces";

const secret = process.env.AUTH_SECRET;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isPublicRoute =
        frontEndPublicRoutes.includes(pathname) ||
        backEndPublicRoutes.includes(pathname);
    const isUnprotectedRoute = unprotectedRoutes.includes(pathname);

    const token = await getToken({ req: request, secret });

    // If the route is unprotected, allow access
    if (isUnprotectedRoute) {
        return NextResponse.next();
    }

    // Handle the root path `/`
    if (pathname === "/") {
        if (token) {
            return NextResponse.redirect(new URL(defaultAuthorizedRoute, request.url));
        } else {
            return NextResponse.redirect(new URL(defaultUnAuthorizedRoute, request.url));
        }
    }

    // If user is NOT authenticated and trying to access a PRIVATE route
    if (!isPublicRoute && !token) {
        if (request.nextUrl.pathname.startsWith("/api")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL(defaultUnAuthorizedRoute, request.url));
    }

    // If user IS authenticated and trying to access a PUBLIC route
    if (isPublicRoute && token) {
        if (request.nextUrl.pathname.startsWith("/api")) {
            return NextResponse.json({ message: "Authorized" }, { status: 200 });
        }
        return NextResponse.redirect(new URL(defaultAuthorizedRoute, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|.*\\.png$).*)",
    ], // Excludes static files and images, but includes API except /api/auth
};
