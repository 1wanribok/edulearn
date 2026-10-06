import { useEffect, useState } from "react";
import { adminLogin, adminGet, adminSend } from "../api.js";
import "./Admin.css";

const fmt = (d) => (d ? new Date(d).toLocaleString() : "");
const emptyCourse = { title: "", category: "", level: "Beginner", duration: "", instructor: "", description: "" };

function Login({ onLogin }) {
  const [v, setV] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const { token } = await adminLogin(v);
      onLogin(token);
    } catch (x) { setErr(x.message); }
  }

  return (
    <section className="wrap narrow">
      <h1>Admin login</h1>
      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="username">Username</label>
          <input id="username" value={v.username} autoComplete="username" onChange={(e) => setV({ ...v, username: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={v.password} autoComplete="current-password" onChange={(e) => setV({ ...v, password: e.target.value })} />
        </div>
        <button className="btn">Log in</button>
        {err && <p className="error" role="alert">{err}</p>}
      </form>
    </section>
  );
}

function CourseForm({ onAdd }) {
  const [v, setV] = useState(emptyCourse);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  function submit(e) {
    e.preventDefault();
    onAdd(v).then((ok) => ok && setV(emptyCourse));
  }
  return (
    <form onSubmit={submit} style={{ marginBottom: "1.2rem" }}>
      <h2>Add a course</h2>
      <div className="course-form">
        <div><label htmlFor="c-title">Title</label><input id="c-title" value={v.title} onChange={set("title")} /></div>
        <div><label htmlFor="c-cat">Category</label><input id="c-cat" value={v.category} onChange={set("category")} /></div>
        <div><label htmlFor="c-level">Level</label>
          <select id="c-level" value={v.level} onChange={set("level")}>
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select></div>
        <div><label htmlFor="c-dur">Duration (e.g. 8 weeks)</label><input id="c-dur" value={v.duration} onChange={set("duration")} /></div>
        <div><label htmlFor="c-ins">Instructor</label><input id="c-ins" value={v.instructor} onChange={set("instructor")} /></div>
        <div className="full"><label htmlFor="c-desc">Description</label><textarea id="c-desc" rows="2" maxLength={500} value={v.description} onChange={set("description")} /></div>
      </div>
      <button className="btn">Add course</button>
    </form>
  );
}

function Dashboard({ token, onLogout }) {
  const [tab, setTab] = useState("students");
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState(null);

  const fail = (err) => {
    if (err.status === 401) onLogout();
    else setMsg({ type: "error", text: err.message });
  };
  const load = () => adminGet(tab, token).then(setRows).catch(fail);

  useEffect(() => { setRows([]); setMsg(null); load(); }, [tab]);

  function remove(id, what) {
    if (!window.confirm(`Delete this ${what}? This cannot be undone.`)) return;
    setMsg(null);
    adminSend(`${tab}/${id}`, "DELETE", null, token).then(load).catch(fail);
  }

  function accept(id) {
    setMsg(null);
    adminSend(`students/${id}/accept`, "POST", null, token).then(load).catch(fail);
  }

  async function addCourse(course) {
    setMsg(null);
    try {
      await adminSend("courses", "POST", course, token);
      setMsg({ type: "ok", text: "Course added. It now shows on the Courses and Register pages." });
      load();
      return true;
    } catch (err) { fail(err); return false; }
  }

  const Del = ({ id, what }) => (
    <button className="btn small danger" onClick={() => remove(id, what)}>Delete</button>
  );

  return (
    <section className="wrap">
      <div className="admin-top">
        <h1>Admin dashboard</h1>
        <button className="btn ghost small" onClick={onLogout}>Log out</button>
      </div>
      <div className="tabs">
        {["students", "courses", "feedback"].map((t) => (
          <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {msg && <p className={msg.type} role="status">{msg.text}</p>}

      {tab === "courses" && <CourseForm onAdd={addCourse} />}

      <div className="table-box">
        <table className="table">
          {tab === "students" && (<>
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Course</th><th>Registered</th><th>Status</th><th></th></tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.id}><td>{r.fullName}</td><td>{r.email}</td><td>{r.phone}</td><td>{r.course}</td><td>{fmt(r.registeredAt)}</td>
                <td className={r.status === "ACCEPTED" ? "ok" : ""}>{r.status === "ACCEPTED" ? "Accepted" : "Pending"}</td>
                <td className="actions">
                  {r.status !== "ACCEPTED" && <button className="btn small" onClick={() => accept(r.id)}>Accept</button>}
                  <Del id={r.id} what="registration" />
                </td></tr>))}</tbody>
          </>)}
          {tab === "courses" && (<>
            <thead><tr><th>Title</th><th>Category</th><th>Level</th><th>Duration</th><th>Instructor</th><th></th></tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.id}><td>{r.title}</td><td>{r.category}</td><td>{r.level}</td><td>{r.duration}</td><td>{r.instructor}</td>
                <td><Del id={r.id} what="course" /></td></tr>))}</tbody>
          </>)}
          {tab === "feedback" && (<>
            <thead><tr><th>Name</th><th>Rating</th><th>Message</th><th>Date</th><th></th></tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.id}><td>{r.name}</td><td>{r.rating} / 5</td><td>{r.message}</td><td>{fmt(r.createdAt)}</td>
                <td><Del id={r.id} what="feedback entry" /></td></tr>))}</tbody>
          </>)}
        </table>
      </div>
      {rows.length === 0 && <p>Nothing here yet.</p>}
    </section>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem("adminToken") || "");
  const login = (t) => { sessionStorage.setItem("adminToken", t); setToken(t); };
  const logout = () => { sessionStorage.removeItem("adminToken"); setToken(""); };
  return token ? <Dashboard token={token} onLogout={logout} /> : <Login onLogin={login} />;
}
