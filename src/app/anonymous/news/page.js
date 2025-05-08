'use client';

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
      {news.map((n) => (
        <DisplayCard key={n.id} {...n} path="/anonymous/news" onDelete={handleDelete} />
      ))}
    </>
  );
}