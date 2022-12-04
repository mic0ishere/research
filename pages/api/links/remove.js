/**
 * @param {import('next/server').NextRequest} request
 * @param {import('next/server').NextResponse} response
 */
export default async function handler(request, response) {
  response.json({ hello: "world" });
}
