import db from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req) {
  const token = (await cookies()).get("session")?.value;
  const session = db.prepare("SELECT * FROM sessions WHERE token = ?").get(token);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { grievance_id, vote } = await req.json();
  const existing = db.prepare("SELECT * FROM grievance_votes WHERE user_id = ? AND grievance_id = ?")
                    .get(session.user_id, grievance_id);

  if (!existing) {
    // New vote
    db.prepare("INSERT INTO grievance_votes (user_id, grievance_id, vote) VALUES (?, ?, ?)")
      .run(session.user_id, grievance_id, vote);
    db.prepare(`UPDATE grievances SET ${vote} = ${vote} + 1 WHERE id = ?`).run(grievance_id);
  } else if (existing.vote === vote) {
    // Undo vote
    db.prepare("DELETE FROM grievance_votes WHERE user_id = ? AND grievance_id = ?")
      .run(session.user_id, grievance_id);
    db.prepare(`UPDATE grievances SET ${vote} = ${vote} - 1 WHERE id = ?`).run(grievance_id);
  } else {
    // Change vote
    db.prepare("UPDATE grievance_votes SET vote = ? WHERE user_id = ? AND grievance_id = ?")
      .run(vote, session.user_id, grievance_id);
    db.prepare(`UPDATE grievances SET ${vote} = ${vote} + 1 WHERE id = ?`).run(grievance_id);
    db.prepare(`UPDATE grievances SET ${existing.vote} = ${existing.vote} - 1 WHERE id = ?`).run(grievance_id);
  }

  return new Response("OK");
}