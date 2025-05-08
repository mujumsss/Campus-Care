'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import classes from './page.module.css';
import DisplayCard from "@/components/cards/news/display";

export default function NewsPage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/news/get-news');
      const data = await res.json();
      setNews(data);
    };
    fetchData();
  }, []);

  const handleDelete = (id) => {
    setNews(prev => prev.filter(g => g.id !== id));
  };

  return (
    <>
      <div className={classes.addNews}>
        <Link href="/admin/news/create" className={classes.link}>Add News</Link>
      </div>
      {news.map((n) => (
        <DisplayCard key={n.id} {...n} path="/admin/news" onDelete={handleDelete} />
      ))}
    </>
  );
}