import { NextResponse } from "next/server";

/**
 * @param {import('next/server').NextRequest} request
 */
export function middleware(request) {
  const { pathname, searchParams } = new URL(request.nextUrl);

  if (pathname === "/api/fetch-title") {
    // awesome api, love it
    return NextResponse.rewrite(
      `https://api.dub.sh/metatags?url=${searchParams.get("url")}`
    );
  } else {
    return NextResponse.next();
  }
}
