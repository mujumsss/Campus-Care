"use server";

import { createNews } from "../news";
import { redirect } from "next/navigation";
import db from "../db";
import { cookies } from "next/headers";

function isInvalidText(text) {
    return !text || text.trim() === '';
}

export async function createNewsAction(prevState, formData) {
    const token = (await cookies()).get('session')?.value;

    if (!token) {
        return { message: 'Unauthorized: Please login.'};
    }

    const session = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
    if (!session) {
        return { message: 'Invalid session. Please log in again'};
    }
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(session.user_id);
    if (user.role === 'anonymous') {
        return { message: 'Anonymous users are not allowed to submit news.'};
    }

    const news = {
        title: formData.get('title'),
        content: formData.get('content'),
        image: formData.get('image')
    };

    if (
        isInvalidText(news.title) ||
        isInvalidText(news.content)
    ) {
        return {
            message: 'Invalid input.',
            title: news.title,
            content: news.content
        }
    }
    await createNews(news);
    redirect("/admin/news");
}