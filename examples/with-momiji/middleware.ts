import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hasAccessToken = request.cookies.get('x-momiji-session');
  const url = request.nextUrl.pathname;

  if (url.startsWith('/login')) {
    if (hasAccessToken) {
      return NextResponse.redirect(new URL('/app', request.url));
    }

    return NextResponse.next();
  }

  if (!hasAccessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (url.startsWith('/logout')) {
    const res = NextResponse.redirect(new URL('/login', request.url));
    request.cookies.getAll().forEach((reqCookie) => {
      res.cookies.delete(reqCookie.name);
    });

    return res;
  }

  if (url === '/') {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/app/:path*', '/login/:path*', '/logout:path*', '/purchase'],
};
