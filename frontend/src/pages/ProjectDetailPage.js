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

const getToken = () => localStorage.getItem("token");

async function updateProject(projectId, fields) {
  const res = await fetch(`/api/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error("프로젝트 수정 실패");
  return await res.json();
}

async function deleteProject(projectId) {
  const res = await fetch(`/api/projects/${projectId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("프로젝트 삭제 실패");
}

// 프로젝트 멤버 불러오기 (API 엔드포인트를 실제 서버에 맞게 수정하세요)
async function fetchProjectMembers(projectId) {
  const res = await fetch(`/api/project-members?projectId=${projectId}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error("프로젝트 멤버를 불러오지 못했습니다.");
  return await res.json();
}

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [activeTab, setActiveTab] = useState("calendar");
  const [editModal, setEditModal] = useState(false);
  const [editFields, setEditFields] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  // 멤버 관련 state
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const userInfo = await getUserInfo();
      setUser(userInfo);

      const projectList = await getProjects();
      setProjects(projectList);

      const projectIdNum = Number(id);
      const project = projectList.find((p) => Number(p.project_id) === projectIdNum);
      setCurrentProject(project);
    }
    fetchData();
  }, [id]);

  const openEditModal = () => {
    setEditFields({
      name: currentProject.project_name,
      description: currentProject.description || currentProject.project_desc || "",
    });
    setEditModal(true);
  };

  const handleEditSave = async () => {
    setLoading(true);
    try {
      await updateProject(currentProject.project_id, {
        name: editFields.name,
        description: editFields.description,
      });
      const projectList = await getProjects();
      setProjects(projectList);
      const projectIdNum = Number(id);
      const project = projectList.find((p) => Number(p.project_id) === projectIdNum);
      setCurrentProject(project);
      setEditModal(false);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
    setLoading(true);
    try {
      await deleteProject(currentProject.project_id);
      alert("프로젝트가 삭제되었습니다.");
      navigate("/dashboard");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMembers = async () => {
    setMembersLoading(true);
    setShowMembers(true);
    try {
      const members = await fetchProjectMembers(currentProject.project_id);
      setMembers(members);
    } catch (e) {
      alert(e.message);
    } finally {
      setMembersLoading(false);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


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
          <div className={styles.profileBox} style={{ position: "relative" }}>
            <h3 style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>프로필</span>
              <button
                className={styles.logoutBtn}
                onClick={handleLogout}
                title="로그아웃"
                style={{ marginLeft: 8 }}
              >
                로그아웃
              </button>
            </h3>
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
                key={proj.project_id}
                className={
                  Number(proj.project_id) === Number(currentProject.project_id)
                    ? styles.projectItem + " " + styles.selectedProject
                    : styles.projectItem
                }
              >
                <button
                  className={styles.projectButton}
                  onClick={() => navigate(`/project/${proj.project_id}`)}
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
        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <h2 className={styles.projectTitle} style={{ marginBottom: 0, flex: 1 }}>
            {currentProject.project_name}
          </h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className={styles.saveBtn}
              style={{ fontSize: 15 }}
              onClick={openEditModal}
              disabled={loading}
            >
              수정
            </button>
            <button
              className={styles.deleteBtn}
              style={{ fontSize: 15 }}
              onClick={handleDelete}
              disabled={loading}
            >
              삭제
            </button>
            <button
              className={styles.memberBtn}
              style={{ fontSize: 15 }}
              onClick={handleShowMembers}
              disabled={loading || !currentProject}
            >
              멤버 보기
            </button>
          </div>
        </div>
        <p className={styles.projectDesc}>
          {currentProject.description || currentProject.project_desc}
        </p>
        <KanbanBoard projectId={currentProject.project_id} />
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

      {/* 프로젝트 멤버 모달 */}
      {showMembers && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>프로젝트 멤버</h3>
            {membersLoading ? (
              <div>불러오는 중...</div>
            ) : (
              <ul style={{ padding: 0, margin: "14px 0 0 0" }}>
                {members.length === 0 ? (
                  <li style={{ color: "#888" }}>멤버가 없습니다.</li>
                ) : (
                  members.map((m) => (
                    <li key={m.id || m.user_id} style={{ marginBottom: 7, listStyle: "none" }}>
                      <b>{m.username}</b> <span style={{ color: "#666", fontSize: 13 }}>({m.email})</span>
                    </li>
                  ))
                )}
              </ul>
            )}
            <div style={{ marginTop: 18 }}>
              <button className={styles.cancelBtn} onClick={() => setShowMembers(false)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 프로젝트 수정 모달 */}
      {editModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>프로젝트 수정</h3>
            <input
              className={styles.input}
              value={editFields.name}
              onChange={e => setEditFields(f => ({ ...f, name: e.target.value }))}
              placeholder="프로젝트 이름"
              autoFocus
              maxLength={50}
            />
            <textarea
              className={styles.input}
              value={editFields.description}
              onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
              placeholder="프로젝트 설명"
              rows={3}
              maxLength={300}
            />
            <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
              <button
                className={styles.saveBtn}
                disabled={loading}
                onClick={handleEditSave}
              >
                저장
              </button>
              <button
                className={styles.cancelBtn}
                disabled={loading}
                onClick={() => setEditModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;