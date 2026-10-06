import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCourses, registerStudent } from "../api.js";

const empty = { fullName: "", email: "", phone: "", courseId: "" };

function validate(v) {
  const e = {};
  if (v.fullName.trim().length < 3) e.fullName = "Enter your full name (at least 3 letters)";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "Enter a valid email address";
  if (v.phone && !/^[6-9]\d{9}$/.test(v.phone)) e.phone = "Enter a 10-digit valid mobile number";
  if (!v.courseId) e.courseId = "Choose a course";
  return e;
}

function Field({ id, label, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <small className="error" role="alert">{error}</small>}
    </div>
  );
}

export default function Register() {
  const [params] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [v, setV] = useState({ ...empty, courseId: params.get("course") || "" });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { getCourses().then(setCourses).catch(() => {}); }, []);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const found = validate(v);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true); setMsg(null);
    try {
      await registerStudent({ ...v, courseId: Number(v.courseId) });
      setMsg({ type: "ok", text: "You are registered. Check your email for the batch timings." });
      setV(empty);
    } catch (err) {
      setErrors(err.fields || {});
      setMsg({ type: "error", text: err.message });
    } finally { setBusy(false); }
  }

  return (
    <section className="wrap narrow">
      <h1>Register for a course</h1>
      <form onSubmit={submit} noValidate>
        <Field id="fullName" label="Full name" error={errors.fullName}>
          <input id="fullName" value={v.fullName} onChange={set("fullName")} autoComplete="name" />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input id="email" type="email" value={v.email} onChange={set("email")} autoComplete="email" />
        </Field>
        <Field id="phone" label="Mobile number (optional)" error={errors.phone}>
          <input id="phone" inputMode="numeric" maxLength={10} value={v.phone} onChange={set("phone")} autoComplete="tel" />
        </Field>
        <Field id="courseId" label="Course" error={errors.courseId}>
          <select id="courseId" value={v.courseId} onChange={set("courseId")}>
            <option value="">Select a course</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </Field>
        <button className="btn" disabled={busy}>{busy ? "Registering…" : "Register"}</button>
        {msg && <p className={msg.type} role="status">{msg.text}</p>}
      </form>
    </section>
  );
}