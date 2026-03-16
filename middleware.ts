import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bloqueia qualquer requisição para arquivos .php
  if (pathname.endsWith('.php') || pathname.endsWith('.php7')) {
    return new NextResponse('Not Found', { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};