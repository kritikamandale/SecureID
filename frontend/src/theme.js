import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5C6BC0",
      light: "#8E99F3",
      dark: "#26418f",
      contrastText: "#fff",
    },
    secondary: {
      main: "#7C4DFF",
      light: "#B47CFF",
      dark: "#3F1DCB",
      contrastText: "#fff",
    },
    success: {
      main: "#00C853",
      light: "#69F0AE",
      dark: "#007B33",
    },
    background: {
      default: "#F4F6FB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1F36",
      secondary: "#5A6A8A",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.01em" },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none", letterSpacing: 0 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 24px",
          fontSize: "0.9rem",
          boxShadow: "none",
          "&:hover": { boxShadow: "0 4px 14px rgba(92,107,192,0.35)" },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #5C6BC0 0%, #7C4DFF 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #4a59b0 0%, #6a3de0 100%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 20px rgba(92,107,192,0.08)",
          border: "1px solid rgba(92,107,192,0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "0.75rem",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight: 700,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "#5A6A8A",
            backgroundColor: "#F4F6FB",
          },
        },
      },
    },
  },
});

export default theme;
