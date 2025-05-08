import db from '@/lib/db';
import { cookies } from 'next/headers';

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const faqId = searchParams.get('id');

  if (!faqId) return new Response('Missing FAQ ID', { status: 400 });

  try {
    const cookieStore = (await cookies());
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) return new Response('Unauthorized', { status: 401 });

    //  Correct query to find user based on session token
    const session = db.prepare('SELECT user_id FROM sessions WHERE token = ?').get(sessionToken);

    if (!session) return new Response('Invalid session', { status: 401 });

    const faq = db.prepare('SELECT * FROM faq WHERE id = ?').get(faqId);

    if (!faq) return new Response('FAQ not found', { status: 404 });

    const user = db.prepare('SELECT role FROM users WHERE id = ?').get(session.user_id);

    //  Use session.user_id instead of user.user_id
    if (!user || user.role !== 'admin') {
      return new Response('You are not authorized to delete this faq', { status: 403 });
    }

    db.prepare('DELETE FROM faq WHERE id = ?').run(faqId);

    return new Response('Deleted successfully', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Internal Server Error', { status: 500 });
  }
}