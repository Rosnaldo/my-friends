import authConfig from "@/auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

const privateRoutes = [
  /^main$/,
];

// @ts-ignore
export default auth((req: any) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname.replace(/^\/|\/$/g, '');
  const isPrivateRoute = privateRoutes.some((route) => route.test(pathname));

  if (isPrivateRoute && !isLoggedIn) {
    return Response.redirect(new URL(
      `/`,
      nextUrl
    ));
  }

  return null;
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
