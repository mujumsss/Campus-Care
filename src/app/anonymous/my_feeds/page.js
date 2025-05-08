'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import classes from './page.module.css';
import DisplayCard from "@/components/cards/grievance/display";

export default function MyFeedsPage() {
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/my-grievances'); // Make this endpoint to return user's grievances
      const data = await res.json();
      setGrievances(data);
    };
    fetchData();
  }, []);

  const handleDelete = (id) => {
    setGrievances(prev => prev.filter(g => g.id !== id));
  };

  return (
    <>
      <div className={classes.addFeed}>
        <Link href="/anonymous/my_feeds/create" className={classes.link}>Add Feed</Link>
      </div>
      {grievances.map((grievance) => (
        <DisplayCard key={grievance.id} {...grievance} path="/anonymous/my_feeds" onDelete={handleDelete} />
      ))}
    </>
  );
}


