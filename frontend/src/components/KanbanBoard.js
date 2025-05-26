import React, { useEffect, useState } from "react";
import styles from "../styles/KanbanBoard.module.css";

// ---- API 함수들 (아래 모두 KanbanBoard 바깥에 선언) ----
const getToken = () => localStorage.getItem("token");

async function fetchColumns(projectId) {
  const res = await fetch(`/api/task-columns/${projectId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("컬럼 불러오기 실패");
  return await res.json();
}
async function createColumn(projectId, name, position) {
  const res = await fetch("/api/task-columns", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ projectId, name, position }),
  });
  if (!res.ok) throw new Error("컬럼 생성 실패");
  return await res.json();
}
async function updateColumn(columnId, name, position) {
  const res = await fetch(`/api/task-columns/${columnId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ name, position }),
  });
  if (!res.ok) throw new Error("컬럼 수정 실패");
}
async function deleteColumn(columnId) {
  const res = await fetch(`/api/task-columns/${columnId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("컬럼 삭제 실패");
}
async function fetchTasks(columnId) {
  const res = await fetch(`/api/tasks/column/${columnId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("작업 불러오기 실패");
  const data = await res.json();
  return data.tasks || [];
}
async function createTask(columnId, title, description, position) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ columnId, title, description, position }),
  });
  if (!res.ok) throw new Error("작업 생성 실패");
  return await res.json();
}
async function deleteTask(taskId) {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("작업 삭제 실패");
}
async function moveTask(taskId, newColumnId, newPosition) {
  const res = await fetch(`/api/tasks/move/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ newColumnId, newPosition }),
  });
  if (!res.ok) throw new Error("작업 이동 실패");
}

// ---- 컴포넌트 함수 내부 ----
export default function KanbanBoard({ projectId }) {
  // 모든 state 선언
  const [columns, setColumns] = useState([]);
  const [tasksByColumn, setTasksByColumn] = useState({});
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({});
  const [dragged, setDragged] = useState(null);
  const [showAddTask, setShowAddTask] = useState({});
  const [showColumnMenu, setShowColumnMenu] = useState({});
  const [editingColumn, setEditingColumn] = useState(null);
  const [columnEditName, setColumnEditName] = useState("");
  const [showAddColumnInput, setShowAddColumnInput] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  // 초기 데이터 불러오기
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const cols = await fetchColumns(projectId);
        setColumns(cols);
        const tasksObj = {};
        for (const col of cols) {
          tasksObj[col.id] = await fetchTasks(col.id);
        }
        setTasksByColumn(tasksObj);
      } catch (e) {
        alert(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line
  }, [projectId]);

  // 작업 추가
  const handleAddTask = async (col) => {
    const title = newTask[col.id];
    if (!title) return;
    const position = (tasksByColumn[col.id]?.length || 0) + 1;
    try {
      await createTask(col.id, title, "", position);
      const updated = await fetchTasks(col.id);
      setTasksByColumn((prev) => ({ ...prev, [col.id]: updated }));
      setNewTask((t) => ({ ...t, [col.id]: "" }));
      setShowAddTask((prev) => ({ ...prev, [col.id]: false }));
    } catch (e) {
      alert(e.message);
    }
  };

  // 작업 삭제
  const handleDeleteTask = async (colId, taskId) => {
    try {
      await deleteTask(taskId);
      const updated = await fetchTasks(colId);
      setTasksByColumn((prev) => ({ ...prev, [colId]: updated }));
    } catch (e) {
      alert(e.message);
    }
  };

  // Drag & Drop
  const handleDragStart = (colId, taskId) => setDragged({ colId, taskId });
  const handleDrop = async (targetColId, idx) => {
    if (!dragged) return;
    const { colId, taskId } = dragged;
    if (colId === targetColId && tasksByColumn[targetColId][idx]?.id === taskId) return setDragged(null);

    try {
      await moveTask(taskId, targetColId, idx + 1);
      const updatedTarget = await fetchTasks(targetColId);
      const updatedOrigin = await fetchTasks(colId);
      setTasksByColumn((prev) => ({
        ...prev,
        [targetColId]: updatedTarget,
        [colId]: updatedOrigin,
      }));
    } catch (e) {
      alert(e.message);
    } finally {
      setDragged(null);
    }
  };

  // 컬럼 추가
  const handleAddColumn = async () => {
    if (!newColumnName.trim()) return;
    try {
      await createColumn(
        projectId,
        newColumnName.trim(),
        columns.length + 1
      );
      setNewColumnName("");
      setShowAddColumnInput(false);
      // reload
      const cols = await fetchColumns(projectId);
      setColumns(cols);
      const tasksObj = {};
      for (const col of cols) {
        tasksObj[col.id] = await fetchTasks(col.id);
      }
      setTasksByColumn(tasksObj);
    } catch (e) {
      alert(e.message);
    }
  };

  // 컬럼 메뉴
  const handleColumnClick = (col) => {
    setShowColumnMenu((prev) => ({
      ...Object.fromEntries(Object.keys(prev).map((k) => [k, false])),
      [col.id]: !prev[col.id],
    }));
    setEditingColumn(null);
  };

  // 컬럼 수정 시작
  const handleEditColumn = (col) => {
    setEditingColumn(col.id);
    setColumnEditName(col.name);
    setShowColumnMenu({});
  };

  // 컬럼 수정 완료
  const handleSaveEditColumn = async (col) => {
    if (!columnEditName.trim()) return;
    try {
      await updateColumn(col.id, columnEditName.trim(), col.position);
      setEditingColumn(null);
      const cols = await fetchColumns(projectId);
      setColumns(cols);
    } catch (e) {
      alert(e.message);
    }
  };

  // 컬럼 삭제
  const handleDeleteColumn = async (col) => {
    if (!window.confirm("정말 컬럼을 삭제하시겠습니까? (작업도 모두 삭제됩니다)")) return;
    try {
      await deleteColumn(col.id);
      const cols = await fetchColumns(projectId);
      setColumns(cols);
      const tasksObj = {};
      for (const c of cols) {
        tasksObj[c.id] = await fetchTasks(c.id);
      }
      setTasksByColumn(tasksObj);
    } catch (e) {
      alert(e.message);
    }
  };

  // ---- JSX ----
  if (loading) return <div>로딩 중...</div>;
  if (columns.length === 0)
    return (
      <div>
        <button
          onClick={() => setShowAddColumnInput(true)}
          className={styles.addColMainBtn}
        >
          + 새 컬럼 추가
        </button>
        {showAddColumnInput && (
          <div className={styles.addColInputGroup}>
            <input
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="컬럼명 입력"
              className={styles.input}
            />
            <button onClick={handleAddColumn} className={styles.addColBtn}>
              추가
            </button>
            <button
              onClick={() => setShowAddColumnInput(false)}
              className={styles.cancelBtn}
            >
              취소
            </button>
          </div>
        )}
      </div>
    );

  return (
    <div>
      <div className={styles.kanbanBoard}>
        {columns.map((col) => (
          <div className={styles.kanbanColumn} key={col.id}>
            <div
              className={styles.kanbanColumnTitle}
              onClick={() => handleColumnClick(col)}
            >
              {editingColumn === col.id ? (
                <>
                  <input
                    value={columnEditName}
                    onChange={(e) => setColumnEditName(e.target.value)}
                    className={styles.input}
                  />
                  <button
                    onClick={() => handleSaveEditColumn(col)}
                    className={styles.saveBtn}
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingColumn(null)}
                    className={styles.cancelBtn}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  {col.name}
                  <span className={styles.dropdownArrow}>▼</span>
                  {showColumnMenu[col.id] && (
                    <div className={styles.columnMenu}>
                      <button
                        onClick={() => handleEditColumn(col)}
                        className={styles.menuBtn}
                      >
                        이름 수정
                      </button>
                      <button
                        onClick={() => handleDeleteColumn(col)}
                        className={styles.menuBtnDanger}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            {tasksByColumn[col.id]?.map((task, idx) => (
              <div
                key={task.id}
                className={styles.kanbanTask}
                draggable
                onDragStart={() => handleDragStart(col.id, task.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(col.id, idx)}
              >
                {task.title}
                <button
                  className={styles.taskDelBtn}
                  title="삭제"
                  onClick={() => handleDeleteTask(col.id, task.id)}
                >
                  ✕
                </button>
              </div>
            ))}
            {showAddTask[col.id] ? (
              <div className={styles.addTaskForm}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="새 작업 제목..."
                  value={newTask[col.id] || ""}
                  onChange={(e) =>
                    setNewTask({ ...newTask, [col.id]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTask(col);
                  }}
                  autoFocus
                />
                <button
                  className={styles.addTaskBtn}
                  onClick={() => handleAddTask(col)}
                >
                  추가
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() =>
                    setShowAddTask((prev) => ({ ...prev, [col.id]: false }))
                  }
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                className={styles.addTaskShowBtn}
                onClick={() =>
                  setShowAddTask((prev) => ({ ...prev, [col.id]: true }))
                }
              >
                + 작업 추가
              </button>
            )}
          </div>
        ))}
        {/* 새 컬럼 추가 버튼 */}
        <div className={styles.kanbanColumn}>
          {showAddColumnInput ? (
            <div className={styles.addColInputGroup}>
              <input
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="컬럼명 입력"
                className={styles.input}
              />
              <button onClick={handleAddColumn} className={styles.addColBtn}>
                추가
              </button>
              <button
                onClick={() => setShowAddColumnInput(false)}
                className={styles.cancelBtn}
              >
                취소
              </button>
            </div>
          ) : (
            <button
              className={styles.addColMainBtn}
              onClick={() => setShowAddColumnInput(true)}
            >
              + 새 컬럼 추가
            </button>
          )}
        </div>
      </div>
    </div>
  );
}