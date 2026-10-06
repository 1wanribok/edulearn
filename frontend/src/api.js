const BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["X-Admin-Token"] = token;
  let res;
  try {
    res = await fetch(BASE + path, { ...options, headers });
  } catch {
    throw { message: "Cannot reach the server. Check that the backend is running.", fields: {} };
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { message: data.message || "Something went wrong", fields: data.fields || {}, status: res.status };
  return data;
}

export const getCourses = () => request("/courses");
export const registerStudent = (body) => request("/students", { method: "POST", body: JSON.stringify(body) });
export const getFeedback = () => request("/feedback");
export const sendFeedback = (body) => request("/feedback", { method: "POST", body: JSON.stringify(body) });

// admin
export const adminLogin = (body) => request("/admin/login", { method: "POST", body: JSON.stringify(body) });
export const adminGet = (path, token) => request("/admin/" + path, {}, token);
export const adminSend = (path, method, body, token) =>
  request("/admin/" + path, { method, body: body ? JSON.stringify(body) : undefined }, token);
