"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import deleteImg from "@/assets/delete.png";
import ModalPortal from "./ModalPortal";
import classes from "./page.module.css";

export default function SettingsPage() {
  const [admins, setAdmins] = useState([]);
  // track the admin currently “pending deletion”
  const [toDelete, setToDelete] = useState(null);

  // load admins
  useEffect(() => {
    fetch("/api/settings/get-admins")
      .then((res) => res.json())
      .then(setAdmins)
      .catch(console.error);
  }, []);

  // remove from UI
  const removeAdmin = (id) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  // call delete-admin endpoint
  const confirmDelete = async () => {
    try {
      const res = await fetch(
        `/api/settings/delete-admin?id=${toDelete.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      removeAdmin(toDelete.id);
      setToDelete(null);
    } catch {
      alert("Failed to delete admin.");
    }
  };

  return (
    <>
      <div className={classes.addAdmin}>
        <Link href="/admin/settings/create" className={classes.link}>
          Add
        </Link>
      </div>

      <table className={classes.table}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Email</th>
            <th>Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.id}</td>
              <td>{admin.email}</td>
              <td>{admin.role}</td>
              <td>
                <button
                  type="button"
                  className={classes.toggleButton}
                  onClick={() => setToDelete(admin)}
                >
                  <Image src={deleteImg} alt="Delete" width={24} height={24} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/*
        If toDelete is non-null, show the confirmation modal
      */}
      {toDelete && (
        <ModalPortal>
          <div
            className={classes.modalOverlay}
            onClick={() => setToDelete(null)}
          >
            <div
              className={classes.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <p>
                Are you sure you want to delete{" "}
                <strong>{toDelete.email}</strong>?<br />
                This action cannot be undone.
              </p>
              <div className={classes.modalActions}>
                <button
                  className={classes.cancelBtn}
                  onClick={() => setToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className={classes.confirmDeleteBtn}
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
}




// "use client";

// import classes from './page.module.css';
// import Link from 'next/link';
// import { useState, useEffect } from 'react';
// import deleteImg from '@/assets/delete.png';
// import Image from 'next/image';
// import ModalPortal from './ModalPortal';

// export default function SettingsPage() {
//     const [admins, setAdmins] = useState([]);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);


//     useEffect(() => {
//         const fetchData = async () => {
//           const res = await fetch('/api/settings/get-admins');
//           const data = await res.json();
//           setAdmins(data);
//           console.log(admins);
//           console.log(data);
//         };
//         fetchData();
//     }, []);

//     const handleDeleteReload = (id) => {
//         setAdmins(prev => prev.filter(f => f.id !== id));
//       };



//     const handleDelete = async () => {
//         try {
//           const res = await fetch(`/api/settings/delete-admin?id=${id}`, {
//             method: 'DELETE',
//           });
    
//           if (res.ok) {
//             setShowDeleteModal(false); // <--- Hide modal immediately after successful delete
//             handleDeleteReload?.(id);             // Notify parent
//           } else {
//             alert("Failed to delete Admin");
//           }
//         } catch (error) {
//           console.error("Error deleting Admin", error);
//         }
//     };  
//     return (
//         <>
//             <div className={classes.addAdmin}>
//                 <Link href="/admin/settings/create" className={classes.link}>Add</Link>
//             </div>
//             <div>
//                 <table  className={classes.table}>
//                     <thead>
//                         <tr>
//                             <th>Id</th>
//                             <th>Email</th>
//                             <th>Role</th>
//                             <th>Delete</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {admins && admins.map((admin) => (
//                             <tr key={admin.id}>
//                                 <td>{admin.id}</td>
//                                 <td>{admin.email}</td>
//                                 <td>{admin.role}</td>
//                                 <td>
//                                     <>
//                                         <button type='button' className={classes.toggleButton} onClick={() => setShowDeleteModal(true)}>
//                                             <Image 
//                                                 src={deleteImg}
//                                                 alt="Delete"
//                                                 width={24}
//                                                 height={24}
//                                             />
//                                         </button> 

//                                         {showDeleteModal && (
//                                             <ModalPortal>
//                                                 <div className={classes.modalOverlay} onClick={() => setShowDeleteModal(false)}>
//                                                   <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
//                                                     <p>Are you sure you want to delete <strong>{show admin email here}</strong>?<br />This action cannot be reversed.</p>
//                                                     <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
//                                                       <button className={classes.cancelBtn} onClick={() => setShowDeleteModal(false)}>Cancel</button>
//                                                       <button className={classes.confirmDeleteBtn} onClick={handleDelete}>Delete</button>
//                                                     </div>
//                                                   </div>
//                                                 </div>
//                                             </ModalPortal>
//                                         )}
//                                     </>

//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </>
//     );
// }