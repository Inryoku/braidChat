// src/styles/theme.ts
export const theme = {
  colors: {
    base: "#1c1c1e", // コンテナや背景の基調色
    accent: "#ff4081", // アクション・強調色（primary）
    text: "#fefefe", // 通常テキスト色
    muted: "#999999", // 補助的・非アクティブな要素
    danger: "#e53935", // エラー・警告用
    inputBg: "#2a2a2a", // インプットの背景
    buttonText: "#ffffff", // ボタン文字色
    bg: "#111111", // アプリ全体の背景（body-level）
  },
  font: {
    heading: "'Gloria Hallelujah', cursive",
    body: "system-ui, sans-serif",
  },
  spacing: {
    sm: "0.5rem",
    md: "0.9rem",
    lg: "2.5rem",
  },
  fontSize: {
    sm: "0.875rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "2.5rem",
  },
  radii: {
    sm: "6px",
    md: "10px",
    lg: "20px",
  },
  shadows: {
    card: "6px 6px 0 #000",
  },
};
