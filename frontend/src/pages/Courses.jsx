import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../api.js";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  useEffect(() => {
    getCourses().then((d) => { setCourses(d); setStatus("ok"); }).catch((e) => setStatus(e.message));
  }, []);

  const cats = useMemo(() => ["All", ...new Set(courses.map((c) => c.category))], [courses]);
  const shown = courses.filter((c) =>
    (cat === "All" || c.category === cat) &&
    (c.title + c.instructor).toLowerCase().includes(q.toLowerCase()));

  return (
    <section className="wrap">
      <h1>Courses</h1>
      <div className="filters">
        <label>Search
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Course or instructor" />
        </label>
        <label>Category
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>
      {status === "loading" && <p>Loading courses…</p>}
      {status !== "loading" && status !== "ok" && <p className="error" role="alert">{status}</p>}
      {status === "ok" && shown.length === 0 && <p>No course matches your search. Clear the filters to see all courses.</p>}
      <div className="grid3">
        {shown.map((c) => (
          <article className="card" key={c.id}>
            <h3>{c.title}</h3>
            <p className="meta">{c.level}, {c.duration}, with {c.instructor}</p>
            <p>{c.description}</p>
            <Link className="btn small" to={`/register?course=${c.id}`}>Enrol in this course</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
