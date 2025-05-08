

'use client';

import { useState, useEffect } from "react";
import DisplayCard from "@/components/cards/grievance/display";

export default function Filter({ myPath }) {
  const [grievances, setGrievances] = useState([]);
  const [filter, setFilter] = useState("most_agreed");
  const [timeFilter, setTimeFilter] = useState("latest");

  useEffect(() => {
    fetch("/api/grievances")
      .then((res) => res.json())
      .then((data) => setGrievances(data))
      .catch((err) => console.error("Failed to load grievances", err));
  }, []);

  const filteredGrievances = [...grievances].sort((a, b) => {
    const timeCompare = timeFilter === "latest"
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at);

    switch (filter) {
      case "most_agreed":
        return b.agree - a.agree;

      case "most_disagreed":
        return b.disagree - a.disagree;

      case "responded":
        if (a.response && !b.response) return -1;
        if (!a.response && b.response) return 1;
        return timeCompare;

      case "not_responded":
        if (!a.response && b.response) return -1;
        if (a.response && !b.response) return 1;
        return timeCompare;

      default:
        return 0;
    }
  });

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="timeFilter">Sort by: </label>
        <select id="timeFilter" value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>

        <label htmlFor="mainFilter" style={{ marginLeft: "1rem" }}>Filter: </label>
        <select id="mainFilter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="most_agreed">Most Agreed</option>
          <option value="most_disagreed">Most Disagreed</option>
          <option value="responded">Responded</option>
          <option value="not_responded">Not Responded</option>
        </select>
      </div>

      {filteredGrievances.map((grievance) => (
        <DisplayCard key={grievance.id} {...grievance} path={myPath} />
      ))}
    </div>
  );
}