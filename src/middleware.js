import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('session')?.value;
  const url = request.nextUrl.clone();

  const protectedPaths = ['/anonymous', '/admin'];

  if (protectedPaths.some(path => url.pathname.startsWith(path))) {
    if (!token) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/anonymous/:path*'],
};