'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import classes from './page.module.css';

export default function ReplyPage({ params }) {
  const grievanceId = params.reply;
  const router = useRouter();
  const [grievance, setGrievance] = useState(null);
  const [reply, setReply] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!grievanceId) return;
  
    fetch(`/api/get-grievance?id=${grievanceId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch grievance');
        }
        return res.json();
      })
      .then(data => setGrievance(data))
      .catch(err => {
        // console.error('Error fetching grievance:', err.message);
        console.log(err.message);
      });
  }, [grievanceId]);

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/reply-grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: grievanceId, response: reply }),
      });

      if (res.ok) {
        router.push('/admin/feeds');
      } else {
        alert('Failed to submit response.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!grievance) return <p>Loading...</p>;

  return (
    <div className={classes.container}>
      <form onSubmit={(e) => { e.preventDefault(); setShowWarning(true); }} className={classes.form}>
        <p>
          <label htmlFor="title">TITLE</label>
          <input id="title" type="text" value={grievance.title} readOnly />
        </p>
        <p>
          <label htmlFor="content">CONTENT</label>
          <textarea id="content" value={grievance.content} rows="10" readOnly />
        </p>
        <p>
          <label htmlFor="reply">REPLY</label>
          <textarea id="reply" name="reply" rows="10" required value={reply} onChange={(e) => setReply(e.target.value)} />
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" onClick={() => router.push('/admin/feeds')} className={classes.cancelBtn}>Cancel</button>
          <button type="submit" className={classes.submitButton}>Submit</button>
        </div>
      </form>

      {showWarning && (
        <div className={classes.modalOverlay} onClick={() => setShowWarning(false)}>
          <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
            <p><strong>Are you sure?</strong><br />You can't change the reply after it's submitted.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className={classes.cancelBtn} onClick={() => setShowWarning(false)}>Cancel</button>
              <button className={classes.confirmDeleteBtn} onClick={handleSubmit}>Confirm Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}