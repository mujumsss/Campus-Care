import db from "@/lib/db";
import { cookies } from "next/headers";

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  // verify session + role
  const cookieStore = (await cookies());
  const token = cookieStore.get("session")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });

  const session = db
    .prepare("SELECT user_id FROM sessions WHERE token = ?")
    .get(token);
  if (!session) return new Response("Invalid session", { status: 401 });

  const user = db
    .prepare("SELECT role FROM users WHERE id = ?")
    .get(session.user_id);
  if (user?.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  // disallow self‐delete
  if (session.user_id === id) {
    return new Response("Cannot delete yourself", { status: 400 });
  }

  // perform delete
  db.prepare("DELETE FROM users WHERE id = ? AND role = 'admin'").run(id);

  return new Response("Deleted", { status: 200 });
}