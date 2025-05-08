import fs from 'fs';
import path from 'path';
import db from '@/lib/db';
import { cookies } from 'next/headers';

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const grievanceId = searchParams.get('id');

  if (!grievanceId) return new Response('Missing grievance ID', { status: 400 });

  try {
    const cookieStore = (await cookies());
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) return new Response('Unauthorized', { status: 401 });

    //  Correct query to find user based on session token
    const session = db.prepare('SELECT user_id FROM sessions WHERE token = ?').get(sessionToken);

    if (!session) return new Response('Invalid session', { status: 401 });

    const grievance = db.prepare('SELECT user_id, image_path FROM grievances WHERE id = ?').get(grievanceId);

    if (!grievance) return new Response('Grievance not found', { status: 404 });

    //  Use session.user_id instead of user.user_id
    if (grievance.user_id !== session.user_id) {
      return new Response('You are not authorized to delete this grievance', { status: 403 });
    }

    if (grievance.image_path) {
      const imagePath = path.join(process.cwd(), 'public', grievance.image_path);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    db.prepare('DELETE FROM grievance_votes WHERE grievance_id = ?').run(grievanceId);
    db.prepare('DELETE FROM grievances WHERE id = ?').run(grievanceId);

    return new Response('Deleted successfully', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Internal Server Error', { status: 500 });
  }
}