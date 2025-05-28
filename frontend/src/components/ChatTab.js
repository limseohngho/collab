import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import styles from "../styles/ChatTab.module.css";

const SOCKET_URL = "http://localhost:5000";
const getToken = () => localStorage.getItem("token");
const getUser = () => JSON.parse(localStorage.getItem("userInfo") || "{}");

const ChatTab = ({ projectId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();
  const userInfo = getUser();

  // 스크롤 아래로
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [messages]);

  // 메시지 불러오기 (DB에서)
  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    fetch(`/api/messages/${projectId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  // 소켓 연결 및 메시지 수신
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("receive_message", (data) => {
      if (data.projectId === projectId) {
        setMessages((prev) => [
          ...prev,
          {
            ...data,
            username: data.username || userInfo.username, // fallback
          }
        ]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
    // userInfo.username이 바뀌면 소켓에서 보낼 때 username도 바뀌어야 함
    // eslint-disable-next-line
  }, [projectId, userInfo.username]);

  // 메시지 전송 (DB 저장 + 소켓 브로드캐스트)
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      // DB에 저장
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          projectId,
          message: input
        }),
      });
      if (!res.ok) throw new Error("메시지 전송 실패");

      // 소켓으로 실시간 전송 (username 반드시 포함)
      socketRef.current.emit("send_message", {
        projectId,
        username: userInfo.username,
        message: input,
        sent_at: new Date().toISOString(),
      });

      setInput("");
    } catch (err) {
      alert("메시지 전송 실패");
    }
  };

  if (!userInfo.username) {
    return <div className={styles.chatNotice}>로그인 후 채팅을 이용할 수 있습니다.</div>;
  }

  return (
    <div className={styles.chatWrapper}>
      <h3 className={styles.chatTitle}>채팅</h3>
      <div className={styles.chatMessages}>
        {loading ? (
          <div className={styles.chatLoading}>불러오는 중...</div>
        ) : messages.length === 0 ? (
          <div className={styles.chatEmpty}>채팅이 없습니다.</div>
        ) : (
          messages.map((msg, idx) => {
            const sender = msg.username || "알 수 없음";
            const isMine = sender === userInfo.username;
            // key는 id + sent_at + username + idx 조합 (중복 방지)
            const key = `${msg.id ?? ""}-${msg.sent_at ?? idx}-${sender}-${idx}`;
            return (
              <div
                key={key}
                className={`${styles.chatMessageRow} ${isMine ? styles.mine : styles.others}`}
              >
                <div
                  className={`${styles.chatMessage} ${isMine ? styles.mine : styles.others}`}
                >
                  <div className={styles.chatMessageSender}>{sender}</div>
                  <div className={styles.chatMessageText}>{msg.message || msg.text}</div>
                  <div className={styles.chatMessageTime}>
                    {msg.sent_at ? new Date(msg.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className={styles.chatForm}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          className={styles.chatInput}
        />
        <button type="submit" className={styles.chatSendBtn} disabled={!input.trim()}>전송</button>
      </form>
    </div>
  );
};

export default ChatTab;