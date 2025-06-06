import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserInfo, getProjects } from "../utils/apiHelpers";
import api from "../utils/api";
import styles from "../styles/ProjectDetailPage.module.css";
import KanbanBoard from "../components/KanbanBoard";
import CalendarTab from "../components/CalendarTab";
import ChatTab from "../components/ChatTab";

async function fetchUserIdByEmail(email) {
  const res = await api.get(`/api/auth/by-email?email=${encodeURIComponent(email)}`);
  if (!res.data || !res.data.id) throw new Error("해당 이메일의 사용자를 찾을 수 없습니다.");
  return res.data.id;
}

async function addOrUpdateProjectMember(projectId, userId, role = "member") {
  const res = await api.post(`/api/project-members/add`, { projectId, userId, role });
  return res.data;
}

async function fetchProjectMembers(projectId) {
  const res = await api.get(`/api/project-members?projectId=${projectId}`);
  if (!res.data) throw new Error("프로젝트 멤버를 불러오지 못했습니다.");
  return res.data;
}

async function updateProject(projectId, fields) {
  const res = await api.put(`/api/projects/${projectId}`, fields);
  return res.data;
}

async function deleteProject(projectId) {
  await api.delete(`/api/projects/${projectId}`);
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
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [showAddInput, setShowAddInput] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addLoading, setAddLoading] = useState(false);

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

  const handleAddMember = async () => {
    if (!addEmail.trim()) return;
    setAddLoading(true);
    try {
      const userId = await fetchUserIdByEmail(addEmail.trim());
      await addOrUpdateProjectMember(currentProject.project_id, userId, "member");
      const updated = await fetchProjectMembers(currentProject.project_id);
      setMembers(updated);
      setShowAddInput(false);
      setAddEmail("");
    } catch (e) {
      alert(e.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/");
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

      <main className={styles.mainContent}>
        <div className={styles.kanbanBoardSection}>
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
        </div>
        <div className={styles.calendarSidebarSection}>
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
              {activeTab === "calendar"
                ? <CalendarTab projectId={currentProject.project_id} />
                : <ChatTab projectId={currentProject.project_id} />}
            </div>
          </div>
        </div>
      </main>

      {showMembers && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>프로젝트 멤버</h3>
            {membersLoading ? (
              <div>불러오는 중...</div>
            ) : (
              <>
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
                {showAddInput ? (
                  <div style={{ marginTop: 15, display: "flex", gap: 6 }}>
                    <input
                      type="email"
                      className={styles.input}
                      placeholder="이메일로 멤버 추가"
                      value={addEmail}
                      onChange={e => setAddEmail(e.target.value)}
                      disabled={addLoading}
                    />
                    <button
                      className={styles.saveBtn}
                      disabled={addLoading || !addEmail.trim()}
                      onClick={handleAddMember}
                    >
                      추가
                    </button>
                    <button
                      className={styles.cancelBtn}
                      disabled={addLoading}
                      onClick={() => { setShowAddInput(false); setAddEmail(""); }}
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <button
                    className={styles.addEventBtn}
                    style={{ marginTop: 16, marginLeft: 0 }}
                    onClick={() => setShowAddInput(true)}
                  >
                    + 멤버 추가
                  </button>
                )}
              </>
            )}
            <div style={{ marginTop: 18 }}>
              <button className={styles.cancelBtn} onClick={() => setShowMembers(false)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

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