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

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { id, url, title, notes, tags, archived, priority } = req.body;

  if (!id) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  let editedTitle = title;
  if (!title) {
    const urlObj = new URL(url);
    editedTitle = urlObj.hostname + urlObj.pathname;
  }

  await dbConnect();
  const link = await Link.findOneAndUpdate(
    { id },
    {
      url,
      title: editedTitle,
      notes,
      tags,
      archived,
      priority,
    }
  );

  res.status(200).json(link);
}
