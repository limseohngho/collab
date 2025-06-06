const API_URL = 'https://collab-backend-9jv5.onrender.com';

export async function getUserInfo() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("로그인 토큰이 없습니다. 다시 로그인해 주세요.");
  const res = await fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("유저 정보를 불러오지 못했습니다");
  return await res.json();
}

export async function getProjects() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("로그인 토큰이 없습니다. 다시 로그인해 주세요.");
  const res = await fetch(`${API_URL}/api/projects`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("프로젝트 목록을 불러오지 못했습니다");
  const data = await res.json();
  return data.projects || [];
}

export async function createProject(name, description) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("로그인 토큰이 없습니다. 다시 로그인해 주세요.");
  const res = await fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, description }),
  });
  if (!res.ok) throw new Error("프로젝트 생성에 실패했습니다");
  return await res.json();
}