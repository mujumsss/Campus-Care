"use server";

import { createFaq } from "../faq";
import { redirect } from "next/navigation";
import db from "../db";
import { cookies } from "next/headers";

function isInvalidText(text) {
    return !text || text.trim() === '';
}

export async function createFaqAction(prevState, formData) {
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
        return { message: 'Anonymous users are not allowed to submit faq.'};
    }

    const faq = {
        question: formData.get('question'),
        answer: formData.get('answer')
    };

    if (
        isInvalidText(faq.question) ||
        isInvalidText(faq.answer)
    ) {
        return {
            message: 'Invalid input.',
            question: faq.question,
            answer: faq.answer
        }
    }
    await createFaq(faq);
    redirect("/admin/faq");
}