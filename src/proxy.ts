import { clerkMiddleware, createRouterMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouterMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

const isOrgSwitchRoute = createRouterMatcher(["/org-selection(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgID } = await auth();

  //Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  //protects non-public routes
  if (!userId) {
    await auth.protect();
  }

  //Allow org selection page
  if (isOrgSwitchRoute(req)) {
    return NextResponse.next();
  }

  // For all protected routes, ensure org is selected
  if (userId && !orgID) {
    const orgSelection = new URL("/org-selection", req.url);
    return NextResponse.redirect(orgSelection);
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for Clerk's auto-proxy path
    "/__clerk/(.*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};