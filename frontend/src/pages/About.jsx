const team = [
  ["Student Name 1", "Frontend (React)"],
  ["Student Name 2", "Backend (Spring Boot)"],
  ["Student Name 3", "Database and testing"],
];

export default function About() {
  return (
    <section className="wrap narrow">
      <h1>About EduLearn</h1>
      <p>EduLearn is a mini learning portal built for the Full Stack Development project. It shows how a React frontend talks to a Java REST API that stores data in PostgreSQL.</p>
      <h2>Problem it solves</h2>
      <p>Working students and graduates find it hard to compare short courses, check who teaches them and enrol without paperwork. EduLearn puts courses, instructors and registration in one place.</p>
      <h2>Technology</h2>
      <ul>
        <li>Frontend: React 18, React Router, Vite, responsive CSS</li>
        <li>Backend: Java 17, Spring Boot, Spring Data JPA, Bean Validation</li>
        <li>Database: PostgreSQL (tables: courses, students, feedback)</li>
      </ul>
      <h2>Team</h2>
      <div className="grid3">
        {team.map(([n, r]) => (<article className="card" key={n}><h3>{n}</h3><p>{r}</p></article>))}
      </div>
    </section>
  );
}
