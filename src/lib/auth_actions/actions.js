"use server";

import { redirect } from "next/navigation";
import { getUser, saveUser, saveAdmin } from "../user";


function isInvalidText(text) {
    return !text || text.trim() === '';
}

export async function signUp(prevState, formData) {
    const user = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    if (
        isInvalidText(user.email) ||
        isInvalidText(user.password) ||
        !user.email.includes('@') ||
        user.password.length < 8
    ) {
        return {
            message: 'Invalid input.',
            email: user.email
        }
    }

    const result = await saveUser(user);

    if (result?.error) {
        return { message: result.error };
    }
    redirect('/login');
}

export async function signUpAdmin(prevState, formData) {
    const user = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    if (
        isInvalidText(user.email) ||
        isInvalidText(user.password) ||
        !user.email.includes('@') ||
        user.password.length < 8
    ) {
        return {
            message: 'Invalid input.',
            email: user.email
        }
    }

    const result = await saveAdmin(user);

    if (result?.error) {
        return { message: result.error };
    }
    redirect('/admin/settings');
}

export async function login(prevState, formData) {
    const user = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    if (
        isInvalidText(user.email) ||
        isInvalidText(user.password) ||
        !user.email.includes('@') ||
        user.password.length < 8
    ) {
        return {
            message: 'Invalid input.',
            email: user.email
        }
    }

    const result = await getUser(user);
    if (result?.error) {
        return { message: result.error };
    }
    if (result.role === 'admin') {
        redirect('/admin');
    } else {
        redirect('/anonymous');
    }
}

// export async function adminLogin(prevState, formData) {
//     const user = {
//         email: formData.get('email'),
//         password: formData.get('password')
//     };

//     if (
//         isInvalidText(user.email) ||
//         isInvalidText(user.password) ||
//         !user.email.includes('@') ||
//         user.password.length < 8
//     ) {
//         return {
//             message: 'Invalid input.'
//         }
//     }

//     const result = await getUser(user);
//     if (result?.error) {
//         return { message: result.error };
//     }
//     if (result.role === 'admin') {
//         redirect('/admin');
//     } else {
//         redirect('/anonymous');
//     }
// }

// export async function logout() {
//     const cookieStore = cookies();
//     const sessionToken = cookieStore.get('session')?.value;

//     if (sessionToken) {
//         db.prepare('DELETE FROM sessions WHERE token = ?').run(sessionToken);
//         cookies().set('session', '', { path: '/', expires: new Date(0) });
//     }

//     redirect('/login');
// }