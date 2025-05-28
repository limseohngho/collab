// 유저 정보 가져오기 (프로필용)
export async function getUserInfo() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("로그인 토큰이 없습니다. 다시 로그인해 주세요.");
  }
  const res = await fetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("getUserInfo error", res.status, body);
    throw new Error("유저 정보를 불러오지 못했습니다");
  }
  return await res.json();
}

// 프로젝트 리스트 가져오기
export async function getProjects() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("로그인 토큰이 없습니다. 다시 로그인해 주세요.");
  }
  const res = await fetch("/api/projects", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("getProjects error", res.status, body);
    throw new Error("프로젝트 목록을 불러오지 못했습니다");
  }
  const data = await res.json();
  return data.projects || [];
}

// 프로젝트 생성
export async function createProject(name, description) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("로그인 토큰이 없습니다. 다시 로그인해 주세요.");
  }
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("createProject error", res.status, body);
    throw new Error("프로젝트 생성에 실패했습니다");
  }
  return await res.json();
}