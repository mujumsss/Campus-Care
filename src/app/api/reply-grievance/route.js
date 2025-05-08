import db from '@/lib/db';
import xss from 'xss';

export async function POST(req) {
  const { id, response } = await req.json();

  if (!id || !response) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  try {
    const stmt = db.prepare('UPDATE grievances SET response = ? WHERE id = ? AND response IS NULL');

    const result = stmt.run(response, id);

    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: 'Already responded or not found' }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Error in reply-grievance:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}