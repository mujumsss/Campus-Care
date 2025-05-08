import { cookies } from "next/headers";
import db from "@/lib/db";

export async function POST() {
    const token = (await cookies()).get('session')?.value;

    if (token) {
        db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
        (await cookies()).set('session', '', {
            expires: new Date(0),
            path: '/',
        });
    }
    
    return new Response(null, { status: 200});
}