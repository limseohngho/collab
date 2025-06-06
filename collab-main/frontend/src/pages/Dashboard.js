import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, getProjects, createProject } from "../utils/apiHelpers";
import styles from "../styles/Dashboard.module.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);

        const projectList = await getProjects();
        setProjects(projectList);
      } catch (e) {
        alert(e.message || "데이터를 불러오지 못했습니다. 다시 로그인 해주세요.");
        navigate("/");
      }
    }
    fetchData();
  }, [navigate]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const newProj = await createProject(newProjectName, newProjectDesc);
      setNewProjectName("");
      setNewProjectDesc("");
      navigate(`/project/${newProj.project_id}`);
    } catch (e) {
      alert(e.message || "프로젝트 생성 실패");
    } finally {
      setCreating(false);
    }
  };

  const handleProjectClick = (proj) => {

    navigate(`/project/${proj.project_id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className={styles.dashboardContainer}>
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
            <p><b>이름:</b> {user.username}</p>
            <p><b>이메일:</b> {user.email}</p>
          </div>
        )}

        <div className={styles.projectsSection}>
          <div className={styles.projectsTitle}>내 프로젝트</div>
          <ul className={styles.projectsList}>
            {projects.map((proj) => (
              <li key={proj.project_id} className={styles.projectItem}>
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