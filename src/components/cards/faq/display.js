"use client";

import classes from './display.module.css';
import plusImg from '@/assets/plus.png';
import minusImg from '@/assets/minus.png';
import deleteImg from '@/assets/delete.png';
import Image from 'next/image';

import { useState } from 'react';
import ModalPortal  from './ModalPortal';

export function DisplayCard({ id, question, answer, isExpanded, onToggle, path, onDelete }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);



    const handleDelete = async () => {
        try {
          const res = await fetch(`/api/faq/delete-faq?id=${id}`, {
            method: 'DELETE',
          });
    
          if (res.ok) {
            setShowDeleteModal(false); // <--- Hide modal immediately after successful delete
            onDelete?.(id);             // Notify parent
          } else {
            alert("Failed to delete FAQ.");
          }
        } catch (error) {
          console.error("Error deleting FAQ:", error);
        }
    };

    answer = answer.replace(/\n/g, '<br />');

    const checkPath = path?.startsWith('/admin');

    console.log('path:', path);
    console.log('checkPath:', checkPath);

    return (
        <div className={classes.card}>
            <header className={classes.header}>
                <h2 className={classes.question}>{question}?</h2>
                <div style={{ display: "flex", alignItems: "center" }}>
                <button type="button" onClick={onToggle} className={classes.toggleButton}>
                    <Image 
                        src={isExpanded ? minusImg : plusImg} 
                        alt={isExpanded ? "Collapse" : "Expand"}
                        width={24}
                        height={24}
                        className={classes.toggle}
                    />
                </button>

                {checkPath && (
                    <>
                        <button type='button' onClick={() => setShowDeleteModal(true)} className={classes.toggleButton}>
                            <Image
                                src={deleteImg}
                                alt="Delete"
                                width={24}
                                height={24}
                                className={classes.toggle}
                            />
                        </button>

                        {showDeleteModal && (
                            <ModalPortal>
                                <div className={classes.modalOverlay} onClick={() => setShowDeleteModal(false)}>
                                  <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
                                    <p>Are you sure you want to delete <strong>{question}</strong>?<br />This action cannot be reversed.</p>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                      <button className={classes.cancelBtn} onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                      <button className={classes.confirmDeleteBtn} onClick={handleDelete}>Delete</button>
                                    </div>
                                  </div>
                                </div>
                            </ModalPortal>
                        )}
                    </>

                )}
                </div>
            </header>
            {isExpanded && (
                <main 
                className={`${classes.answer} ${isExpanded ? classes.expanded : classes.collapsed}`}
                dangerouslySetInnerHTML={{ __html: answer }}>
                    
                </main>
            )}
        </div>
    );
}