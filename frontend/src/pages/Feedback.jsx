import { useEffect, useState } from "react";
import { getFeedback, sendFeedback } from "../api.js";

export default function Feedback() {
  const [list, setList] = useState([]);
  const [v, setV] = useState({ name: "", rating: 5, message: "" });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState(null);

  const load = () => getFeedback().then(setList).catch(() => {});
  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    const found = {};
    if (!v.name.trim()) found.name = "Enter your name";
    if (!v.message.trim()) found.message = "Write a short message";
    setErrors(found);
    if (Object.keys(found).length) return;
    try {
      await sendFeedback({ ...v, rating: Number(v.rating) });
      setV({ name: "", rating: 5, message: "" });
      setMsg({ type: "ok", text: "Thanks, your feedback is saved." });
      load();
    } catch (err) {
      setErrors(err.fields || {});
      setMsg({ type: "error", text: err.message });
    }
  }

  return (
    <section className="wrap two">
      <div>
        <h1>Feedback</h1>
        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="name">Your name</label>
            <input id="name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
            {errors.name && <small className="error">{errors.name}</small>}
          </div>
          <div className="field">
            <label htmlFor="rating">Rating</label>
            <select id="rating" value={v.rating} onChange={(e) => setV({ ...v, rating: e.target.value })}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} out of 5</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="4" maxLength={500} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} />
            {errors.message && <small className="error">{errors.message}</small>}
          </div>
          <button className="btn">Send feedback</button>
          {msg && <p className={msg.type} role="status">{msg.text}</p>}
        </form>
      </div>
      <div>
        <h2>Recent feedback</h2>
        {list.length === 0 && <p>No feedback yet. Be the first to write one.</p>}
        {list.map((f) => (
          <article className="card" key={f.id}>
            <p className="meta">{f.name} rated {f.rating} out of 5</p>
            <p>{f.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
