import db from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  const token = (await cookies()).get('session')?.value;
  const session = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);

  if (!session) return new Response('Unauthorized', { status: 401 });

  const grievances = db.prepare('SELECT * FROM grievances WHERE user_id = ? ORDER BY created_at DESC').all(session.user_id);
  return Response.json(grievances);
}