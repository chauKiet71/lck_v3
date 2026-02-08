import { withAuth } from "next-auth/middleware"

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            console.log(`[Middleware] Checking auth for: ${req.nextUrl.pathname}`);
            console.log(`[Middleware] Token exists: ${!!token}`);
            if (req.nextUrl.pathname.startsWith("/admin/login")) {
                return true; // Always allow access to login page
            }
            return !!token;
        },
    },
    pages: {
        signIn: "/admin/login",
    },
})

export const config = { matcher: ["/admin/:path*"] }
