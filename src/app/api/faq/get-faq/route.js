import db from '@/lib/db.js';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const faqs = db.prepare('SELECT * FROM faq').all();
        return NextResponse.json(faqs);
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
    }
}