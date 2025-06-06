import React, { useEffect, useState, useCallback } from "react";
import styles from "../styles/ProjectDetailPage.module.css";
import api from "../utils/api";

const COLUMNS = [
  { key: "TODO", label: "할 일" },
  { key: "IN_PROGRESS", label: "진행 중" },
  { key: "DONE", label: "완료" }
];

async function fetchTasks(projectId) {
  const res = await api.get(`/api/tasks/project/${projectId}`);
  if (!res.data || !Array.isArray(res.data.tasks)) throw new Error("작업 불러오기 실패");
  return res.data.tasks || [];
}

async function createTask(projectId, title, description, status) {
  const res = await api.post("/api/tasks", { projectId, title, description, status });
  return res.data;
}

async function updateTask(taskId, fields) {
  const res = await api.put(`/api/tasks/${taskId}`, fields);
  return res.data;
}

async function deleteTask(taskId) {
  await api.delete(`/api/tasks/${taskId}`);
}

export default function KanbanBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({});
  const [dragged, setDragged] = useState(null);
  const [editModal, setEditModal] = useState({ open: false, task: null });
  const [editFields, setEditFields] = useState({ title: "", description: "" });

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      setTasks(await fetchTasks(projectId));
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const handleAddTask = async (status) => {
    const title = (newTask[status] || "").trim();
    if (!title) return;
    try {
      await createTask(projectId, title, "", status);
      await loadTasks();
      setNewTask((t) => ({ ...t, [status]: "" }));
    } catch (e) {
      alert(e.message);
    }
  };

  const handleTaskClick = (task) => {
    setEditModal({ open: true, task });
    setEditFields({ title: task.title, description: task.description || "" });
  };

  const handleEditSave = async () => {
    try {
      await updateTask(editModal.task.id, {
        title: editFields.title,
        description: editFields.description
      });
      await loadTasks();
      setEditModal({ open: false, task: null });
    } catch (e) {
      alert(e.message);
    }
  };

  const handleEditDelete = async () => {
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await deleteTask(editModal.task.id);
      await loadTasks();
      setEditModal({ open: false, task: null });
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDragStart = (task) => setDragged(task);
  const handleDrop = async (status) => {
    if (!dragged) return;
    if (dragged.status === status) return setDragged(null);
    try {
      await updateTask(dragged.id, { status });
      await loadTasks();
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
              <button className={styles.saveBtn} onClick={handleEditSave}>저장</button>
              <button className={styles.deleteBtn} onClick={handleEditDelete}>삭제</button>
              <button className={styles.cancelBtn} onClick={() => setEditModal({ open: false, task: null })}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}