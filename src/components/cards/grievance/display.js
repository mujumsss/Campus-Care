'use client';

import { useState, useEffect } from "react";
import Image from 'next/image';
import classes from './display.module.css';
import { useRouter } from "next/navigation";
import closeImg from '@/assets/close.png';

export default function DisplayCard({ id, title, image_path, content, agree, disagree, response, created_at, path, onDelete }) {
  const [userVote, setUserVote] = useState(null);
  const [agreeCount, setAgreeCount] = useState(agree);
  const [disagreeCount, setDisagreeCount] = useState(disagree);
  const [showFullImage, setShowFullImage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const router = useRouter();

  const checkPath = path?.startsWith('/anonymous/my_feeds');
  const checkPathAdmin = path?.startsWith('/admin');

  useEffect(() => {
    fetch(`/api/vote-status?grievance_id=${id}`)
      .then(res => res.json())
      .then(data => setUserVote(data.vote))
      .catch(() => setUserVote(null));
  }, [id]);

  const handleVote = async (voteType) => {
    await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grievance_id: id, vote: voteType })
    });

    if (userVote === voteType) {
      voteType === "agree" ? setAgreeCount(agreeCount - 1) : setDisagreeCount(disagreeCount - 1);
      setUserVote(null);
    } else {
      if (voteType === "agree") {
        setAgreeCount(agreeCount + 1);
        if (userVote === "disagree") setDisagreeCount(disagreeCount - 1);
      } else {
        setDisagreeCount(disagreeCount + 1);
        if (userVote === "agree") setAgreeCount(agreeCount - 1);
      }
      setUserVote(voteType);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/delete-grievance?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onDelete?.(id);
      } else {
        alert("Failed to delete grievance.");
      }
    } catch (error) {
      console.error("Error deleting grievance:", error);
    }
  };

  content = content.replace(/\n/g, '<br />');
  if (response) {
    response = response.replace(/\n/g, '<br />');
  }

  const formatTimeAgo = (created_at) => {
    const created = new Date(`${created_at}Z`);
    const diff = Date.now() - created.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day(s) ${hours % 24} hr(s) ago`;
    if (hours > 0) return `${hours} hr(s) ${minutes % 60} min(s) ago`;
    if (minutes > 0) return `${minutes} min(s) ago`;
    return `${seconds} sec(s) ago`;
  };

  return (
    <div className={classes.card}>
      <p className={classes.timestamp}>{formatTimeAgo(created_at)}</p>
      <h2 className={classes.title}>{title}</h2>

      <div className={classes.imageAndText}>
        {image_path && (
          <div onClick={() => setShowFullImage(true)} className={classes.imageThumb}>
            <Image
              src={image_path}
              alt={title}
              width={250}
              height={180}
              className={classes.image}
            />
          </div>
        )}
        <p className={classes.content} dangerouslySetInnerHTML={{ __html: content }}></p>
      </div>

      {showFullImage && (
        <div className={classes.modalOverlay} onClick={() => setShowFullImage(false)}>
          <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={() => setShowFullImage(false)} className={classes.closeBtn}>
              <Image 
                src={closeImg} 
                alt="close"
                width={24}
                height={24}
              />
            </button>
            <Image
              src={image_path}
              alt={title}
              width={800}
              height={600}
              className={classes.fullImage}
            />
          </div>
        </div>
      )}

      <div className={classes.actions}>
        <button
          disabled={checkPathAdmin}
          onClick={() => handleVote('agree')}
          style={{ backgroundColor: userVote === 'agree' ? '#c1f0c1' : undefined }}
        >
          {`Agree ${agreeCount}`}
        </button>
        <button
          disabled={checkPathAdmin}
          onClick={() => handleVote('disagree')}
          style={{ backgroundColor: userVote === 'disagree' ? '#f9c0c0' : undefined }}
        >
          {`Disagree ${disagreeCount}`}
        </button>
      </div>

      {response && (
        <div className={classes.response}>
          <h3>Admin Response</h3>
          <p dangerouslySetInnerHTML={{
            __html: response
            }}></p>
        </div>
      )}

      {checkPath && (
        <>
          <button className={classes.deleteBtn} onClick={() => setShowDeleteModal(true)}>Delete</button>

          {showDeleteModal && (
            <div className={classes.modalOverlay} onClick={() => setShowDeleteModal(false)}>
              <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
                <p>Are you sure you want to delete <strong>{title}</strong>?<br />This action cannot be reversed.</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className={classes.cancelBtn} onClick={() => setShowDeleteModal(false)}>Cancel</button>
                  <button className={classes.confirmDeleteBtn} onClick={handleDelete}>Delete</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {checkPathAdmin && !response && <button className={classes.replyBtn} onClick={() => router.push(`/admin/feeds/${id}`)} >Reply</button>}
    </div>
  );
}