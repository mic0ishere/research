import { authOptions } from "../auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth/next";
import Link, { getNextId } from "../../../lib/linkModel";

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

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { url, title, notes, tags, priority } = req.body;

  if (!url || !title) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const id = await getNextId();

  const link = await Link.create({
    id,
    url,
    title,
    notes,
    tags,
    date: new Date(),
    archived: false,
    priority: priority || 0,
  });

  res.status(201).json(link);
}
