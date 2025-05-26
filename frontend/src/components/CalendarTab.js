import React, { useState } from "react";
// 예시: react-calendar 또는 FullCalendar 등 사용 가능
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../styles/CalendarTab.module.css";

const CalendarTab = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([
    // { date: "2025-05-26", title: "프로젝트 킥오프", id: 1 }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // 일정 추가
  const handleAddEvent = (date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setShowModal(true);
  };

  // 일정 클릭 시 수정
  const handleEventClick = (event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  // 일정 저장
  const handleSaveEvent = (title) => {
    if (editingEvent) {
      setEvents(events.map(ev => ev.id === editingEvent.id ? { ...ev, title, date: selectedDate.toISOString().slice(0, 10) } : ev));
    } else {
      setEvents([
        ...events,
        {
          id: Date.now(),
          date: selectedDate.toISOString().slice(0, 10),
          title
        }
      ]);
    }
    setShowModal(false);
  };

  return (
    <div className={styles.calendarTab}>
      <div className={styles.calendarHeader}>
        <span>일정</span>
        <button className={styles.addBtn} onClick={() => handleAddEvent(new Date())}>＋</button>
      </div>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={({ date }) => {
          // 해당 날짜에 이벤트가 있으면 dot 표시
          const event = events.find(ev => ev.date === date.toISOString().slice(0, 10));
          return event ? <div className={styles.dot}></div> : null;
        }}
        onClickDay={date => {
          const event = events.find(ev => ev.date === date.toISOString().slice(0, 10));
          if (event) handleEventClick(event);
        }}
      />
      {showModal && (
        <EventModal
          date={selectedDate}
          event={editingEvent}
          onSave={handleSaveEvent}
          onClose={() => setShowModal(false)}
        />
      )}
      <ul className={styles.eventList}>
        {events
          .filter(ev => ev.date === selectedDate.toISOString().slice(0, 10))
          .map(ev => (
            <li key={ev.id} onClick={() => handleEventClick(ev)}>
              {ev.title}
            </li>
          ))}
      </ul>
    </div>
  );
};

const EventModal = ({ date, event, onSave, onClose }) => {
  const [title, setTitle] = useState(event ? event.title : "");
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>{event ? "일정 수정" : "일정 추가"}</h3>
        <div>{date.toISOString().slice(0, 10)}</div>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="일정 제목" />
        <button onClick={() => onSave(title)} disabled={!title}>저장</button>
        <button onClick={onClose}>취소</button>
      </div>
    </div>
  );
};

export default CalendarTab;