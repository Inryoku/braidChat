import styled from "@emotion/styled";
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
  linkWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { theme } from "../styles/theme";

const Container = styled.div`
  max-width: 500px;
  margin: 80px auto;
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.base};
  color: ${theme.colors.text};
  border-radius: ${theme.radii.lg};
  font-family: ${theme.font.heading};
  box-shadow: ${theme.shadows.card};
`;

const Title = styled.h1`
  font-size: ${theme.fontSize.xl};
  color: ${theme.colors.accent};
  margin-bottom: ${theme.spacing.lg};
`;

const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.muted};
  border-radius: ${theme.radii.md};
  font-size: ${theme.fontSize.md};
  background-color: ${theme.colors.inputBg};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
`;

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps {
  variant?: ButtonVariant;
}

const Button = styled.button<ButtonProps>`
  background-color: ${({ variant = "primary" }) =>
    variant === "primary"
      ? theme.colors.accent
      : variant === "secondary"
      ? theme.colors.muted
      : theme.colors.danger};
  color: ${theme.colors.buttonText};
  padding: ${theme.spacing.md};
  border: none;
  border-radius: ${theme.radii.md};
  cursor: pointer;
  margin-bottom: ${theme.spacing.md};
  font-weight: bold;

  &:hover {
    opacity: 0.85;
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log("現在のUID:", auth.currentUser?.uid);
    console.log("匿名か？:", auth.currentUser?.isAnonymous);
  }, []);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user && !user.isAnonymous) {
        navigate("/chat");
      }
    });
    return () => unsub();
  }, []);

  const handleAnonymousLogin = async () => {
    try {
      await signInAnonymously(auth);
      navigate("/chat");
    } catch (err) {
      console.error("匿名ログイン失敗:", err);
    }
  };

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("がちログイン失敗:", err);
    }
  };

  const handleEmailSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("新規登録失敗:", err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Googleログイン失敗:", err);
    }
  };

  const handleUpgrade = async () => {
    try {
      const credential = EmailAuthProvider.credential(email, password);
      if (auth.currentUser) {
        await linkWithCredential(auth.currentUser, credential);
      } else {
        console.error("現在のユーザーが存在しません");
      }
      console.log("昇格成功");
    } catch (err) {
      console.error("昇格失敗:", err);
    }
  };

  const handleUpgradeWithGoogle = async () => {
    try {
      console.log("昇格前 UID:", auth.currentUser?.uid);
      const provider = new GoogleAuthProvider();
      await linkWithPopup(auth.currentUser, provider);
      console.log("昇格後 UID:", auth.currentUser?.uid);
      console.log("匿名か？:", auth.currentUser?.isAnonymous);
      navigate("/chat");
    } catch (err: any) {
      if (err.code === "auth/credential-already-in-use") {
        console.error(
          "このGoogleアカウントはすでに別のユーザーに紐づいています"
        );
      } else {
        console.error("Google昇格失敗:", err);
      }
    }
  };

  return (
    <Container>
      <Title>ログイン画面</Title>

      <div>
        <Input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleEmailLogin} variant="primary">
          ログイン
        </Button>
        <Button onClick={handleEmailSignUp} variant="secondary">
          新規登録
        </Button>
        <Button onClick={handleUpgrade} variant="danger">
          匿名アカウントを昇格
        </Button>
        <Button onClick={handleUpgradeWithGoogle} variant="secondary">
          Googleで昇格
        </Button>
      </div>

      <hr />

      <Button onClick={handleGoogleLogin} variant="secondary">
        Googleでログイン
      </Button>
      <Button onClick={handleAnonymousLogin} variant="primary">
        今すぐ利用する
      </Button>
    </Container>
  );
}
