// middleware.js

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(req) {
  const user = (await getToken({
    req: req,
  }));
  const role = user?.user?.data?.profile.role
  const roleHomeUrl = {
    "Super Admin":"/dashboard",
    "Admin":"/user-management",
    "Content Manager":"/category",
    "Hospital Admin": "/hospital"
  }

  const { pathname } = req.nextUrl;
  
  if (user) {
    if (pathname === "/" || pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL(roleHomeUrl[role], req.url));
    }
  } else {
    if (!pathname.startsWith("/login"))
    return NextResponse.redirect(new URL("/login", req.url));
  }
}


export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};

