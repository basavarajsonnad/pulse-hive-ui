import type { ThemeConfig } from "antd";

// Single source of truth for Ant Design theming.
// Prefer tokens here over SCSS overrides for anything AntD exposes.
const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#1677ff",
    borderRadius: 6,
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
  },
  components: {
    Button: {
      controlHeight: 40,
    },
  },
};

export default themeConfig;
