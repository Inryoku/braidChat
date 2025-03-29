import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import styled from "@emotion/styled";
import { theme } from "../styles/theme";

const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: ${theme.spacing.lg};
  color: ${theme.colors.text};
  background-color: ${theme.colors.bg};
  font-family: ${theme.font.body};
`;

const MessageBubble = styled.div<{ isOwn: boolean }>`
  text-align: ${({ isOwn }) => (isOwn ? "right" : "left")};
  background-color: ${({ isOwn }) => (isOwn ? "#e0f7fa" : "#f1f1f1")};
  margin: ${theme.spacing.sm} 0;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.radii.sm};
  max-width: 60%;
  align-self: ${({ isOwn }) => (isOwn ? "flex-end" : "flex-start")};
  color: #000;
`;

const TimestampText = styled.div`
  font-size: ${theme.fontSize.sm};
  color: #555;
`;

const Input = styled.input`
  padding: ${theme.spacing.sm};
  border-radius: ${theme.radii.sm};
  font-size: ${theme.fontSize.md};
  margin-right: ${theme.spacing.sm};
  color: #000;
`;

const Button = styled.button`
  padding: ${theme.spacing.sm};
  border-radius: ${theme.radii.sm};
  font-size: ${theme.fontSize.md};
  background-color: ${theme.colors.accent};
  color: ${theme.colors.buttonText};
  border: none;
  cursor: pointer;
  margin-top: ${theme.spacing.sm};
`;

export default function Chat() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChatMessages(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("ログアウト失敗:", err);
    }
  };

  const handleSendMessage = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    try {
      await addDoc(collection(db, "messages"), {
        text: trimmed,
        uid: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
      });
      setInputText("");
    } catch (err) {
      console.error("メッセージ送信失敗:", err);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "";
    const date = timestamp.toDate();
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  if (loading) return <div>読み込み中...</div>;

  return (
    <Wrapper>
      <h1>チャット画面</h1>
      {auth.currentUser?.isAnonymous && (
        <div>
          <p>アカウントを登録すると履歴が保存できます</p>
          <Button onClick={() => navigate("/login")}>
            アカウント登録して引き継ぐ
          </Button>
        </div>
      )}
      <div>
        {chatMessages.map((msg) => (
          <MessageBubble key={msg.id} isOwn={msg.uid === auth.currentUser?.uid}>
            <div>{msg.text}</div>
            <TimestampText>{formatTimestamp(msg.createdAt)}</TimestampText>
          </MessageBubble>
        ))}
      </div>
      <div>
        <Input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="メッセージを入力"
        />
        <Button onClick={handleSendMessage}>送信</Button>
      </div>
      <Button onClick={handleLogout}>ログアウト</Button>
    </Wrapper>
  );
}
