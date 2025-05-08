import fs from 'fs';
import path from 'path';
import db from '@/lib/db';
import { cookies } from 'next/headers';

export async function DELETE(request) {
    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get('id');
  
    if (!newsId) return new Response('Missing news ID', { status: 400 });

    try {
        const cookieStore = (await cookies());
        const sessionToken = cookieStore.get('session')?.value;

        if (!sessionToken) return new Response('Unauthorized', { status: 401 });

        //making sure 
        const session = db.prepare('SELECT user_id FROM sessions WHERE token = ?').get(sessionToken);

        if (!session) return new Response('Invalid session', { status: 401 });

        const news = db.prepare('SELECT * FROM news WHERE id = ?').get(newsId);

        if (!news) return new Response('News not found', { status: 404 });
        const isAdmin = db.prepare('SELECT role FROM users WHERE id = ?').get(session.user_id);
        console.log(isAdmin);
        
        if (!isAdmin || isAdmin.role !== 'admin') {
            return new Response('You are not an admin. Cannot delete this news.', { status: 403 });
        }
        if (news.image_path) {
            const imagePath = path.join(process.cwd(), 'public', news.image_path);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }

        db.prepare('DELETE FROM news WHERE id = ?').run(newsId);

        return new Response('Deleted successfully', { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response('Internal Server Error', {status: 500});
    }
}