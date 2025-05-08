"use client";

import { useActionState } from 'react';
import classes from './page.module.css';
import ImagePicker from '@/components/image-picker/image-picker';
import { createFeed } from '@/lib/feed_actions/actions';

export default function CreateFeed() {
    const [state, formAction, pending] = useActionState(createFeed, {message: null, title: null, content: null});
    return (
        <div className={classes.container}>
          <form action={formAction} className={classes.form}>
            <p>
              <label htmlFor="title">TITLE</label>
              <input id="title" type="text" name="title" required />
            </p>
            <p>
              <label htmlFor="content">CONTENT</label>
              <textarea id="content" name="content" rows="10" required />
            </p>
            <ImagePicker />
            {state.message && <p className={classes.error}>{state.message}</p>}
            <button className={classes.submitButton} type="submit" disabled={pending}>
              {pending ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
    );
}