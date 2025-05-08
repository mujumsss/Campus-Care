"use client";

import { useActionState } from 'react';
import classes from './page.module.css';
import { createFaqAction } from '@/lib/faq_actions/actions';

export default function CreateNews() {
    const [state, formAction, pending] = useActionState(createFaqAction, {message: null, question: null, answer: null});
    return (
        <div className={classes.container}>
          <form action={formAction} className={classes.form}>
            <p>
              <label htmlFor="question">QUESTION</label>
              <input id="question" type="text" name="question" defaultValue={state.question || ''} placeholder="Don't put question mark '?' at end, I'll do it for you :)" required />
            </p>
            <p>
              <label htmlFor="answer">ANSWER</label>
              <textarea id="answer" name="answer" rows="10" defaultValue={state.answer || ''} placeholder='Answer to the question' required />
            </p>
            {state.message && <p className={classes.error}>{state.message}</p>}
            <button className={classes.submitButton} type="submit" disabled={pending}>
              {pending ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
    );
}