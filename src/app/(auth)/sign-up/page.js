"use client";

import Link from "next/link";
import classes from './page.module.css'
import { signUp } from "@/lib/auth_actions/actions";
import { useActionState } from "react";

export default function SignUp() {
    const [state, formAction, pending] = useActionState(signUp, {message: null, email: null});
    return (
        <div className={classes.container}>
            <form className={classes.card} action={formAction}>
                <h1>Sign Up</h1>
                <div className={classes.field}>
                    <label htmlFor="email">Email:</label>
                    <input id="email" type="email" placeholder="user@gmail.com" name="email" defaultValue={state.email || ''} required></input>
                </div>
                <div className={classes.field}>
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" placeholder="••••••••" minLength={8} name="password" required></input>
                </div>
                {state.message && <p className={classes.error}>{state.message}</p>}
                <div className={classes.actions}>
                    <Link className={classes.link} href="/login">Login?</Link>
                    <button type="submit" disabled={pending}>
                        {pending ? "Submitting...": "Register"}
                    </button>
                </div>
            </form>
        </div>
    );
}