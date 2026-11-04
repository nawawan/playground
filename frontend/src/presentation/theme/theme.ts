import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2459B8", dark: "#163C82" },
    text: { primary: "#1E2329", secondary: "#5D6672" },
    divider: "#E1E5EA",
    background: { default: "#FFFFFF", paper: "#FFFFFF" },
  },
  typography: {
    fontFamily: '"Inter", "Noto Sans JP", system-ui, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "#root": { maxWidth: "none", margin: 0, padding: 0 },
        body: { backgroundColor: "#FFFFFF", color: "#1E2329" },
        a: { color: "inherit", fontWeight: "inherit" },
        "a:hover": { color: "inherit" },
        h1: { fontSize: "inherit", lineHeight: "inherit" },
      },
    },
  },
});

export const BUTTON_BORDER_COLOR = "#D5DAE1";
export const TAG_BACKGROUND_COLOR = "#EAF0FB";
export const AVATAR_PLACEHOLDER_COLOR = "#E8EBEF";
