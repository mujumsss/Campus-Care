"use server";

import { createGrievance } from "../grievance";
import { redirect } from "next/navigation";
import db from "../db";
import { cookies } from "next/headers";

function isInvalidText(text) {
    return !text || text.trim() === '';
}

export async function createFeed(prevState, formData) {
    const token = (await cookies()).get('session')?.value;

    if (!token) {
        return { message: 'Unauthorized: Please login.'};
    }

    const session = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
    if (!session) {
        return { message: 'Invalid session. Please log in again'};
    }
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(session.user_id);
    if (user.role === 'admin') {
        return { message: 'Admins are not allowed to submit grievances.'};
    }

    const grievance = {
        user_id: session.user_id,
        title: formData.get('title'),
        content: formData.get('content'),
        image: formData.get('image')
    };

    if (
        isInvalidText(grievance.title) ||
        isInvalidText(grievance.content)
    ) {
        return {
            message: 'Invalid input.',
            title: grievance.title,
            content: grievance.content
        }
    }
    await createGrievance(grievance);
    redirect("/anonymous/feeds");
}