import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const links = [
  ["/", "Home"], ["/courses", "Courses"], ["/about", "About"],
  ["/register", "Register"], ["/feedback", "Feedback"], ["/admin", "Admin"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <Link to="/" className="brand" onClick={() => setOpen(false)}>EduLearn</Link>
      <button className="burger" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(!open)}>
        {open ? "Close" : "Menu"}
      </button>
      <nav className={open ? "open" : ""}>
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>{label}</NavLink>
        ))}
      </nav>
    </header>
  );
}
