import db from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(req) {
  const token = (await cookies()).get("session")?.value;
  const session = db.prepare("SELECT * FROM sessions WHERE token = ?").get(token);
  if (!session) return new Response(JSON.stringify({ vote: null }), { status: 401 });

  const { searchParams } = new URL(req.url);
  const grievance_id = searchParams.get("grievance_id");

  const result = db.prepare(
    "SELECT vote FROM grievance_votes WHERE user_id = ? AND grievance_id = ?"
  ).get(session.user_id, grievance_id);

  return Response.json({ vote: result?.vote || null });
}