import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(['/dashboard/admin(.*)', '/admin(.*)']);
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api/system/config(.*)', '/gatekeeper', '/api/admin/verify-gatekeeper', '/omni-gate']);
const isIdentityRoute = createRouteMatcher(['/onboarding(.*)', '/api/auth/onboard(.*)', '/api/auth/sync(.*)', '/api/users/me(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // 1. ADMIN PROTECTION
  if (isAdminRoute(req)) {
    if (!userId) return NextResponse.redirect(new URL('/', req.url));
    const bossToken = req.cookies.get('OMNI_BOSS_TOKEN');
    if (!bossToken || bossToken.value !== 'AUTHORIZED_ADMIN') {
      return NextResponse.redirect(new URL('/gatekeeper', req.url));
    }
  }

  // 2. IDENTITY PROTECTION (The Strict Guard)
  // If signed in, not on a public route, and not already on the onboarding flow
  if (userId && !isPublicRoute(req) && !isIdentityRoute(req)) {
    const identityVerified = req.cookies.get('OMNI_IDENTITY_VERIFIED');

    if (!identityVerified || identityVerified.value !== 'TRUE') {
      console.log(`[IDENTITY GUARD] User ${userId} unauthorized for ${pathname}. Redirecting to /onboarding`);
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
  }

  // Security: Clear Tokens if signed out
  if (!userId && (req.cookies.has('OMNI_BOSS_TOKEN') || req.cookies.has('OMNI_IDENTITY_VERIFIED'))) {
    const response = NextResponse.next();
    response.cookies.delete('OMNI_BOSS_TOKEN');
    response.cookies.delete('OMNI_IDENTITY_VERIFIED');
    return response;
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
