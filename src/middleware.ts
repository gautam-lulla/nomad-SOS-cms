import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to handle CMS edit mode cookie.
 * Sets a cookie when ?edit=true is in the URL so the server can bypass cache.
 * Removes the cookie when ?edit=false or edit param is not present.
 */
export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const editParam = searchParams.get('edit');
  const response = NextResponse.next();

  if (editParam === 'true') {
    // Set cookie for edit mode (expires in 1 hour)
    response.cookies.set('cms-edit-mode', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
    });
  } else if (editParam === 'false') {
    // Explicitly exiting edit mode - remove the cookie
    response.cookies.delete('cms-edit-mode');
  }
  // If no edit param, leave cookie as-is (allows navigating between pages in edit mode)

  return response;
}

export const config = {
  // Run middleware on all page routes (not API routes, static files, etc.)
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
