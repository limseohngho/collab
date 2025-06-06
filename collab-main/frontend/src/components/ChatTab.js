import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import styles from "../styles/ChatTab.module.css";
import api from "../utils/api";

const SOCKET_URL = "https://collab-backend-9jv5.onrender.com"; // Render 백엔드 주소로 변경

const getToken = () => localStorage.getItem("token");
const getUser = () => JSON.parse(localStorage.getItem("userInfo") || "{}");

const ChatTab = ({ projectId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();
  const userInfo = getUser();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    api
      .get(`/api/messages/${projectId}`)
      .then((res) => {
        setMessages(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("receive_message", (data) => {
      if (data.projectId === projectId) {
        setMessages((prev) => [
          ...prev,
          {
            ...data,
            username: data.username || userInfo.username,
          },
        ]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [projectId, userInfo.username]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      await api.post("/api/messages", {
        projectId,
        message: input,
      });

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
                    {msg.sent_at
                      ? new Date(msg.sent_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
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
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          className={styles.chatInput}
        />
        <button type="submit" className={styles.chatSendBtn} disabled={!input.trim()}>
          전송
        </button>
      </form>
    </div>
  );
};

export default ChatTab;