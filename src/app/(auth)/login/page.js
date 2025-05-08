"use client";

import Link from "next/link";
import classes from './page.module.css'
import { useActionState } from "react";
import { login } from "@/lib/auth_actions/actions";

export default function Login() {
    const [state, formAction, pending] = useActionState(login, {message: null, email: null});
    return (
        <div className={classes.container}>
            <form className={classes.card} action={formAction}>
                <h1>Login</h1>
                <div className={classes.field}>
                    <label htmlFor="email">Email:</label>
                    <input id="email" type="email" placeholder="email@gmail.com" name="email" defaultValue={state.email || ''} required></input>
                </div>
                <div className={classes.field}>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" placeholder="••••••••" minLength={8} name="password" required></input>
                </div>
                {state.message && <p className={classes.error}>{state.message}</p>}
                <div className={classes.actions}>
                    <Link href="/sign-up" className={classes.link}>Sign Up?</Link>
                    <button type="submit" disabled={pending}>
                        {pending ? "Logging in...": "Login"}
                    </button>
                </div>
            </form>
        </div>
    );
}