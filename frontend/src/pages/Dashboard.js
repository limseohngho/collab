import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// 예시로 API 함수들 import (실제 파일 경로와 함수명은 프로젝트에 맞게 수정)
import { getUserInfo, getProjects, createProject } from "../api"; 
import styles from "../styles/Dashboard.module.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  // 유저 정보 및 프로젝트 목록 불러오기
  useEffect(() => {
    async function fetchData() {
      const userInfo = await getUserInfo(); // JWT 토큰 기반 API 호출
      setUser(userInfo);

      const projectList = await getProjects();
      setProjects(projectList);
    }
    fetchData();
  }, []);

  // 프로젝트 생성 핸들러
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createProject(newProjectName, newProjectDesc);
      // 프로젝트 생성 후 목록 갱신
      const projectList = await getProjects();
      setProjects(projectList);
      setNewProjectName("");
      setNewProjectDesc("");
    } finally {
      setCreating(false);
    }
  };

  // 프로젝트 클릭 시 상세페이지로 이동
  const handleProjectClick = (proj) => {
    // 상세페이지 경로는 /project/:id로 이동
    navigate(`/project/${proj.id}`);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* 사이드바: 프로필 + 내 프로젝트 */}
      <div className={styles.sidebar}>
        {/* 1. 프로필 창 */}
        {user && (
          <div className={styles.profileBox}>
            <h3>프로필</h3>
            <p><b>이름:</b> {user.username}</p>
            <p><b>이메일:</b> {user.email}</p>
          </div>
        )}

        {/* 2. 프로젝트 목록 */}
        <div className={styles.projectsSection}>
          <div className={styles.projectsTitle}>내 프로젝트</div>
          <ul className={styles.projectsList}>
            {projects.map((proj) => (
              <li key={proj.id} className={styles.projectItem}>
                <button
                  className={styles.projectButton}
                  onClick={() => handleProjectClick(proj)}
                >
                  {proj.project_name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 메인: 새 프로젝트 생성 */}
      <main className={styles.mainContent}>
        <div className={styles.createProjectBox}>
          <h3>새 프로젝트 생성</h3>
          <form className={styles.createProjectForm} onSubmit={handleCreateProject}>
            <input
              type="text"
              placeholder="프로젝트 이름"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="프로젝트 설명"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
            />
            <button type="submit" disabled={creating}>
              {creating ? "생성 중..." : "생성"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;