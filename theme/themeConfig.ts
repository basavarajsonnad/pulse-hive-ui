import type { ThemeConfig } from "antd";

// Single source of truth for Ant Design theming.
// Prefer tokens here over SCSS overrides for anything AntD exposes.
const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#7c3aed",
    colorText: "#1f2033",
    colorTextSecondary: "#8b8fa3",
    colorBorder: "#e3e4ec",
    colorBorderSecondary: "#eeeff5",
    borderRadius: 6,
    fontSize: 13,
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
  },
  components: {
    Table: {
      headerBg: "#ffffff",
      headerColor: "#8b8fa3",
      headerSplitColor: "transparent",
      rowHoverBg: "#f1f4ff",
      cellPaddingBlockSM: 10,
      cellPaddingInlineSM: 14,
    },
    Tabs: {
      horizontalMargin: "0",
      titleFontSize: 13,
    },
  },
};

export default themeConfig;
