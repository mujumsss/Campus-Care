import db from "./db";
import bcrypt from 'bcrypt';
import { cookies } from "next/headers";
import crypto from 'crypto';

export async function saveUser(user) {
    const userExists = db.prepare('SELECT * FROM users WHERE email = ?').get(user.email)

    if (userExists) {
        return { error: 'User already exists'};
    }

    user.hashed_password = await bcrypt.hash(user.password, 10);
    const adminExists = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
    user.role = adminExists ? 'user' : 'admin';

    db.prepare(`
        INSERT INTO users
        (email, hashed_password, role)
        VALUES (
            @email,
            @hashed_password,
            @role
        )
    `).run(user);

    return { success: true, role: user.role };
}

export async function saveAdmin(user) {
    const userExists = db.prepare('SELECT * FROM users WHERE email = ?').get(user.email)

    if (userExists) {
        return { error: 'Admin already exists'};
    }

    user.hashed_password = await bcrypt.hash(user.password, 10);
    user.role = 'admin';

    db.prepare(`
        INSERT INTO users
        (email, hashed_password, role)
        VALUES (
            @email,
            @hashed_password,
            @role
        )
    `).run(user);

    return { success: true, role: user.role };
}

export async function getUser(user) {
    const foundUser = db.prepare('SELECT * FROM users WHERE email = ?').get(user.email);

    if (!foundUser) {
        return { error: 'User not found'};
    }

    const passwordMatch = await bcrypt.compare(user.password, foundUser.hashed_password);

    if (!passwordMatch) {
        return { error: 'Incorrect password'};
    }

    //token and expiry
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    db.prepare(`
        INSERT INTO sessions 
        (user_id, token, expires_at)
        VALUES (?, ?, ?)
    `).run(foundUser.id, token, expiresAt.toISOString());

    db.prepare(`
        DELETE FROM sessions
        WHERE expires_at <= datetime('now')
    `).run();

    //set cookie
    (await cookies()).set('session', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        expires: expiresAt
    });
    return { success: true, role: foundUser.role }
}