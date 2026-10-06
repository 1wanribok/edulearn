import { Link } from "react-router-dom";

const week = [
  ["Mon", "Web Development", "7 pm"],
  ["Wed", "Data Structures", "7 pm"],
  ["Fri", "Spoken English", "6 pm"],
  ["Sat", "Statistics", "10 am"],
];
const features = [
  ["Evening and weekend batches", "Every course runs outside office hours, so you can learn without leaving your job."],
  ["Practice after every lesson", "Short problem sets and graded projects keep you coding, writing or calculating."],
  ["Mentors who reply", "Ask a question on any lesson and an instructor answers within a day."],
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>Learn something new between Monday and Saturday.</h1>
            <p className="lead">Short, instructor-led courses in technology, language, mathematics and business. Pick a course, register in a minute, start this week.</p>
            <div className="row">
              <Link className="btn" to="/courses">Browse courses</Link>
              <Link className="btn ghost" to="/register">Register now</Link>
            </div>
          </div>
          <div className="timetable" aria-label="Sample weekly timetable">
            <h2>A sample week</h2>
            {week.map(([d, c, t]) => (
              <div className="slot" key={d}><b>{d}</b><span>{c}</span><em>{t}</em></div>
            ))}
          </div>
        </div>
      </section>
      <section className="wrap">
        <h2>Why students choose EduLearn</h2>
        <div className="grid3">
          {features.map(([t, d]) => (<article className="card" key={t}><h3>{t}</h3><p>{d}</p></article>))}
        </div>
      </section>
    </>
  );
}
