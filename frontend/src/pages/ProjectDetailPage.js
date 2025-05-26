import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserInfo, getProjects } from "../api";
import styles from "../styles/ProjectDetailPage.module.css";
import KanbanBoard from "../components/KanbanBoard";

const CalendarTab = () => (
  <div>
    <h3 style={{ color: "#2274A5", marginBottom: 12 }}>캘린더</h3>
    <div style={{ color: "#888" }}>캘린더 기능 예정</div>
  </div>
);

const ChatTab = () => (
  <div>
    <h3 style={{ color: "#2274A5", marginBottom: 12 }}>채팅</h3>
    <div style={{ color: "#888" }}>채팅 기능 예정</div>
  </div>
);

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [activeTab, setActiveTab] = useState("calendar");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const userInfo = await getUserInfo();
      setUser(userInfo);

      const projectList = await getProjects();
      setProjects(projectList);

      // id를 반드시 정수로 비교 (DB id가 숫자일 때 안전)
      const projectIdNum = Number(id);
      const project = projectList.find((p) => Number(p.id) === projectIdNum);
      setCurrentProject(project);
    }
    fetchData();
  }, [id]);

  if (projects.length > 0 && !currentProject)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ff5555",
          fontWeight: "bold",
        }}
      >
        프로젝트 정보를 찾을 수 없습니다. (잘못된 URL이거나 DB에 존재하지 않는 프로젝트)
      </div>
    );

  if (!currentProject)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#2274A5",
          fontWeight: "bold",
        }}
      >
        프로젝트 정보를 불러오는 중...
      </div>
    );

  return (
    <div className={styles.container}>
      {/* 좌측 사이드바 */}
      <div className={styles.sidebar}>
        {user && (
          <div className={styles.profileBox}>
            <h3>프로필</h3>
            <p>
              <b>이름:</b> {user.username}
            </p>
            <p>
              <b>이메일:</b> {user.email}
            </p>
          </div>
        )}
        <div className={styles.projectsSection}>
          <div className={styles.projectsTitle}>내 프로젝트</div>
          <ul className={styles.projectsList}>
            {projects.map((proj) => (
              <li
                key={proj.id}
                className={
                  proj.id === currentProject.id
                    ? styles.projectItem + " " + styles.selectedProject
                    : styles.projectItem
                }
              >
                <button
                  className={styles.projectButton}
                  onClick={() => navigate(`/project/${proj.id}`)}
                >
                  {proj.project_name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 중앙: 프로젝트 이름 + 칸반 보드 */}
      <main className={styles.mainContent}>
        <h2 className={styles.projectTitle}>
          {currentProject.project_name}
        </h2>
        <p className={styles.projectDesc}>
          {currentProject.project_desc}
        </p>
        {/* 반드시 currentProject.id를 넘겨주세요! */}
        <KanbanBoard projectId={currentProject.id} />
      </main>

      {/* 우측 사이드바: 탭 */}
      <div className={styles.rightSidebar}>
        <div className={styles.tabBar}>
          <button
            className={`${styles.tabButton} ${activeTab === "calendar" ? styles.active : ""}`}
            onClick={() => setActiveTab("calendar")}
          >
            일정
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "chat" ? styles.active : ""}`}
            onClick={() => setActiveTab("chat")}
          >
            채팅
          </button>
        </div>
        <div className={styles.tabContent}>
          {activeTab === "calendar" ? <CalendarTab /> : <ChatTab />}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;