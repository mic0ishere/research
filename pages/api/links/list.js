import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import Link from "../../../lib/linkModel";
import dbConnect from "../../../lib/dbConnect";

/**
 * @param {import('next/server').NextRequest} req
 * @param {import('next/server').NextResponse} res
 */

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ error: "Not authorized" });
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  await dbConnect();
  const links = await Link.find({});
  res.status(200).json({
    links,
  });
}
