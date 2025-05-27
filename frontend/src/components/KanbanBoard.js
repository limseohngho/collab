import React, { useEffect, useState } from "react";
import styles from "../styles/ProjectDetailPage.module.css";

const COLUMNS = [
  { key: "TODO", label: "할 일" },
  { key: "IN_PROGRESS", label: "진행 중" },
  { key: "DONE", label: "완료" }
];

const getToken = () => localStorage.getItem("token");

async function fetchTasks(projectId) {
  const res = await fetch(`/api/tasks/project/${projectId}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error("작업 불러오기 실패");
  const data = await res.json();
  return data.tasks || [];
}

async function createTask(projectId, title, description, status) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify({ projectId, title, description, status })
  });
  if (!res.ok) throw new Error("작업 생성 실패");
  return await res.json();
}

async function updateTask(taskId, fields) {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(fields)
  });
  if (!res.ok) throw new Error("작업 수정 실패");
  return await res.json();
}

async function deleteTask(taskId) {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  if (!res.ok) throw new Error("작업 삭제 실패");
}

export default function KanbanBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({});
  const [dragged, setDragged] = useState(null);
  const [editModal, setEditModal] = useState({ open: false, task: null });
  const [editFields, setEditFields] = useState({ title: "", description: "" });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const taskList = await fetchTasks(projectId);
        setTasks(taskList);
      } catch (e) {
        alert(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId]);

  const handleAddTask = async (status) => {
    const title = (newTask[status] || "").trim();
    if (!title) return;
    try {
      await createTask(projectId, title, "", status);
      const updated = await fetchTasks(projectId);
      setTasks(updated);
      setNewTask((t) => ({ ...t, [status]: "" }));
    } catch (e) {
      alert(e.message);
    }
  };

  // 수정 모달 열기
  const handleTaskClick = (task) => {
    setEditModal({ open: true, task });
    setEditFields({ title: task.title, description: task.description || "" });
  };

  // 수정 반영
  const handleEditSave = async () => {
    try {
      await updateTask(editModal.task.id, {
        title: editFields.title,
        description: editFields.description
      });
      setTasks(await fetchTasks(projectId));
      setEditModal({ open: false, task: null });
    } catch (e) {
      alert(e.message);
    }
  };

  // 삭제
  const handleEditDelete = async () => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await deleteTask(editModal.task.id);
      setTasks(await fetchTasks(projectId));
      setEditModal({ open: false, task: null });
    } catch (e) {
      alert(e.message);
    }
  };

  // Drag & Drop
  const handleDragStart = (task) => setDragged(task);
  const handleDrop = async (status) => {
    if (!dragged) return;
    if (dragged.status === status) return setDragged(null);
    try {
      await updateTask(dragged.id, { status });
      setTasks(await fetchTasks(projectId));
    } catch (e) {
      alert(e.message);
    } finally {
      setDragged(null);
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className={styles.kanbanBoard}>
      {COLUMNS.map((col) => (
        <div
          key={col.key}
          className={styles.kanbanColumn}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(col.key)}
        >
          <div className={`${styles.kanbanColumnTitle} ${col.key.toLowerCase()}`}>
            {col.label}
          </div>
          {/* 작업 리스트 */}
          {tasks.filter((task) => task.status === col.key).map((task) => (
            <div
              className={styles.kanbanTask}
              key={task.id}
              draggable
              onDragStart={() => handleDragStart(task)}
              onClick={() => handleTaskClick(task)}
              style={{ cursor: "pointer" }}
            >
              <div>{task.title}</div>
              <div style={{ fontSize: 13, color: "#888" }}>{task.description}</div>
            </div>
          ))}
          {/* 작업 추가 입력 */}
          <div className={styles.addTaskForm}>
            <input
              className={styles.input}
              type="text"
              placeholder="새 작업 제목..."
              value={newTask[col.key] || ""}
              onChange={(e) =>
                setNewTask((prev) => ({ ...prev, [col.key]: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTask(col.key);
              }}
            />
            <button
              className={styles.addTaskBtn}
              onClick={() => handleAddTask(col.key)}
            >
              추가
            </button>
          </div>
        </div>
      ))}

      {/* 수정/삭제 모달 */}
      {editModal.open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>작업 수정</h3>
            <input
              className={styles.input}
              value={editFields.title}
              onChange={e => setEditFields(f => ({ ...f, title: e.target.value }))}
              placeholder="제목 입력"
              autoFocus
            />
            <textarea
              className={styles.input}
              value={editFields.description}
              onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
              placeholder="설명 입력"
              rows={3}
            />
            <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
              <button className={styles.saveBtn} onClick={handleEditSave}>
                저장
              </button>
              <button className={styles.deleteBtn} onClick={handleEditDelete}>
                삭제
              </button>
              <button className={styles.cancelBtn} onClick={() => setEditModal({ open: false, task: null })}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}