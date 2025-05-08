import db from '@/lib/db.js';
import { cookies } from 'next/headers';

// export async function GET() {

//     try {
//         const admins = db.prepare("SELECT * FROM users WHERE role = 'admin'").all();
//         return Response.json(admins);
//     } catch(err) {
//         console.error('Error fetching admins', err);
//     }
// }

export async function GET(request) {
    const cookieStore = (await cookies());
    const token = cookieStore.get('session')?.value;
    // look up current user
    const session = db.prepare("SELECT user_id FROM sessions WHERE token = ?").get(token);
    const meId = session?.user_id;
    const admins = db
      .prepare("SELECT id, email, role FROM users WHERE role = 'admin' AND id != ?")
      .all(meId);
    return Response.json(admins);
  }