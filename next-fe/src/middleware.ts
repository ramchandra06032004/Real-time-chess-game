import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/login' || path === '/signup' || path.startsWith('/verify/');
  const isAdminPath = path.startsWith('/admin');

  // Use next-auth's getToken to get the token from the request
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (!isPublicPath && !token) {    
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (isAdminPath && token?.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/play',
    '/login',
    '/signup',
    '/verify/:path*',
    '/admin/:path*',
  ],
};