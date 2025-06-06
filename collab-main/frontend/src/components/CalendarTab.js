import React, { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "../utils/api";
import styles from "../styles/CalendarTab.module.css";

const localizer = momentLocalizer(moment);

const pastelColors = [
  "#AEE9F9", "#B2F2D7", "#FFD6E0", "#FFF7AE",
  "#FFE2B2", "#d1c4e9", "#FFDEE9", "#E2F0CB"
];

function getRandomPastelColor(id) {
  if (id !== undefined && id !== null) {
    let hash = 0;
    for (let i = 0; i < String(id).length; i++) {
      hash = String(id).charCodeAt(i) + ((hash << 5) - hash);
    }
    return pastelColors[Math.abs(hash) % pastelColors.length];
  }
  return pastelColors[Math.floor(Math.random() * pastelColors.length)];
}

function EmptyToolbar() { return null; }

function CalendarTab({ projectId }) {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const fetchEvents = useCallback(() => {
    if (!projectId) return;
    api.get(`/api/events?projectId=${projectId}`)
      .then(res => setEvents(res.data.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        start: new Date(e.start_time || e.startTime),
        end: new Date(e.end_time || e.endTime),
        createdBy: e.created_by || e.createdBy,
      }))))
      .catch(console.error);
  }, [projectId]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleSelectSlot = slotInfo => {
    setSelectedEvent({ title: "", description: "", start: slotInfo.start, end: slotInfo.end });
    setShowModal(true);
  };

  const handleSelectEvent = event => { setSelectedEvent(event); setShowModal(true); };

  const handleSave = async eventData => {
    if (!eventData.title || !eventData.start || !eventData.end) {
      alert("제목과 시작/종료 시간을 모두 입력하세요."); return;
    }
    try {
      if (eventData.id) {
        await api.put(`/api/events/${eventData.id}`, {
          title: eventData.title,
          startTime: moment(eventData.start).format("YYYY-MM-DD HH:mm:ss"),
          endTime: moment(eventData.end).format("YYYY-MM-DD HH:mm:ss"),
          description: eventData.description,
        });
      } else {
        await api.post(`/api/events`, {
          projectId,
          title: eventData.title,
          startTime: moment(eventData.start).format("YYYY-MM-DD HH:mm:ss"),
          endTime: moment(eventData.end).format("YYYY-MM-DD HH:mm:ss"),
          description: eventData.description,
          createdBy: userInfo.id
        });
      }
      fetchEvents();
      setShowModal(false);
    } catch (error) {
      alert("일정 저장에 실패했습니다."); console.error(error);
    }
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/api/events/${id}`);
      fetchEvents();
      setShowModal(false);
    } catch (error) {
      alert("일정 삭제에 실패했습니다."); console.error(error);
    }
  };

  const eventPropGetter = event => ({
    style: {
      background: getRandomPastelColor(event.id),
      color: "#2274A5",
      borderRadius: '8px',
      border: 'none',
      boxShadow: '0 2px 8px rgba(34,116,165,0.08)',
      padding: '5px 9px',
      fontSize: '15px',
      fontWeight: 600,
      transition: 'background 0.18s'
    }
  });

  return (
    <div className={styles.calendarWrapper}>
      <button
        className={styles.addEventBtn}
        onClick={() => {
          setSelectedEvent({ title: "", description: "", start: new Date(), end: new Date() });
          setShowModal(true);
        }}
        title="일정 추가"
      >추가</button>
      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        popup
        messages={{
          next: "다음", previous: "이전", today: "오늘",
          month: "월", week: "주", day: "일", agenda: "목록",
          showMore: total => `+${total}개 더보기`
        }}
        className={styles.calendar}
        components={{ toolbar: EmptyToolbar }}
        eventPropGetter={eventPropGetter}
      />
      {showModal && (
        <EventModal
          event={selectedEvent}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function EventModal({ event, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(event || { title: "", start: new Date(), end: new Date(), description: "" });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>{event && event.id ? "일정 수정" : "일정 생성"}</h3>
        <input
          className={styles.input}
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="제목"
        />
        <textarea
          className={styles.input}
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="설명"
        />
        <input
          className={styles.input}
          name="start"
          type="datetime-local"
          value={moment(form.start).format("YYYY-MM-DDTHH:mm")}
          onChange={e => setForm({ ...form, start: new Date(e.target.value) })}
        />
        <input
          className={styles.input}
          name="end"
          type="datetime-local"
          value={moment(form.end).format("YYYY-MM-DDTHH:mm")}
          onChange={e => setForm({ ...form, end: new Date(e.target.value) })}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button className={styles.saveBtn} onClick={() => onSave(form)}>저장</button>
          {event && event.id && (
            <button className={styles.deleteBtn} onClick={() => onDelete(event.id)}>삭제</button>
          )}
          <button className={styles.cancelBtn} onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default CalendarTab;