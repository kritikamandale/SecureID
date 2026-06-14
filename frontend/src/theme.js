import { createTheme } from "@mui/material/styles";

const CYAN = "#0891b2";
const CYAN_LIGHT = "#22d3ee";
const CYAN_DARK = "#0e7490";

const cyanAlpha = (alpha) => `rgba(8, 145, 178, ${alpha})`;

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: CYAN,
      light: CYAN_LIGHT,
      dark: CYAN_DARK,
      contrastText: "#ffffff",
    },
    secondary: {
      main: CYAN_DARK,
      light: CYAN,
      dark: "#164e63",
      contrastText: "#ffffff",
    },
    success: { main: "#059669", light: "#34d399", dark: "#047857" },
    warning: { main: "#d97706", light: "#fbbf24", dark: "#92400e" },
    error:   { main: "#dc2626", light: "#f87171", dark: "#991b1b" },
    background: { default: "transparent", paper: "#ffffff" },
    text: {
      primary:   "#0f172a",
      secondary: "#475569",
      disabled:  "#94a3b8",
    },
    divider: "rgba(0,0,0,0.08)",
    action: {
      hover:             cyanAlpha(0.06),
      selected:          cyanAlpha(0.1),
      disabled:          "rgba(0,0,0,0.26)",
      disabledBackground:"rgba(0,0,0,0.06)",
    },
  },

  typography: {
    fontFamily: '"DM Sans", "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontFamily: '"Outfit", "DM Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.01em",
      textShadow: "0 0 40px rgba(8,145,178,0.18), 0 0 80px rgba(8,145,178,0.08)",
    },
    h2: {
      fontFamily: '"Outfit", "DM Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.01em",
      textShadow: "0 0 32px rgba(8,145,178,0.15), 0 0 64px rgba(8,145,178,0.07)",
    },
    h3: {
      fontFamily: '"Outfit", "DM Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: "0em",
      textShadow: "0 0 24px rgba(8,145,178,0.12)",
    },
    h4: {
      fontFamily: '"Outfit", "DM Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: "0.01em",
    },
    h5: {
      fontFamily: '"Outfit", "DM Sans", sans-serif',
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
    h6: {
      fontFamily: '"Outfit", "DM Sans", sans-serif',
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
    button: { fontWeight: 700, textTransform: "none", letterSpacing: "0.03em" },
    overline: {
      fontFamily: '"Outfit", "DM Sans", sans-serif',
      letterSpacing: "0.18em",
      fontWeight: 600,
    },
  },

  shape: { borderRadius: 12 },

  components: {
    // ── Card ───────────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          background: "#ffffff",
          border: "1px solid rgba(8,145,178,0.1)",
          borderRadius: 16,
          boxShadow: "0 1px 4px rgba(0,0,0,0.05), 0 8px 24px rgba(8,145,178,0.06)",
          transition: "border-color 0.25s, box-shadow 0.25s, transform 0.25s",
          "&:hover": {
            borderColor: cyanAlpha(0.3),
            boxShadow: "0 8px 32px rgba(8,145,178,0.18), 0 0 0 1px rgba(8,145,178,0.08), 0 0 24px rgba(8,145,178,0.1)",
          },
        },
      },
    },

    // ── Paper ──────────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: 14,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        },
        elevation0: { boxShadow: "none", border: "none" },
      },
    },

    // ── AppBar ─────────────────────────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(8,145,178,0.1)",
          boxShadow: "none",
          color: "#0f172a",
        },
      },
    },

    // ── Button ─────────────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 24px",
          fontSize: "0.9rem",
          fontWeight: 700,
          transition: "all 0.22s ease",
          "&:hover": { transform: "translateY(-1px)" },
          "&:active": { transform: "translateY(0)" },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${CYAN_LIGHT} 0%, ${CYAN} 100%)`,
          color: "#ffffff",
          boxShadow: `0 4px 16px ${cyanAlpha(0.35)}, 0 0 0 0 ${cyanAlpha(0)}`,
          "&:hover": {
            background: `linear-gradient(135deg, ${CYAN} 0%, ${CYAN_DARK} 100%)`,
            boxShadow: `0 8px 28px ${cyanAlpha(0.45)}, 0 0 20px ${cyanAlpha(0.3)}`,
            transform: "translateY(-2px)",
          },
          "&.Mui-disabled": {
            background: "rgba(0,0,0,0.08)",
            color: "rgba(0,0,0,0.26)",
          },
        },
        outlinedPrimary: {
          borderColor: cyanAlpha(0.5),
          color: CYAN,
          "&:hover": {
            borderColor: CYAN,
            background: cyanAlpha(0.06),
            boxShadow: `0 4px 16px ${cyanAlpha(0.15)}`,
          },
        },
        outlinedInherit: {
          borderColor: "rgba(0,0,0,0.18)",
          color: "#475569",
          "&:hover": { borderColor: "rgba(0,0,0,0.35)", background: "rgba(0,0,0,0.02)" },
        },
        text: {
          color: CYAN,
          "&:hover": { background: cyanAlpha(0.06) },
        },
      },
    },

    // ── TextField ──────────────────────────────────────────────────
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            background: "#f8fafc",
            color: "#0f172a",
            "& fieldset": { borderColor: "rgba(0,0,0,0.15)" },
            "&:hover fieldset": { borderColor: cyanAlpha(0.5) },
            "&.Mui-focused fieldset": { borderColor: CYAN, borderWidth: 1.5 },
          },
          "& .MuiInputLabel-root": {
            color: "#64748b",
            "&.Mui-focused": { color: CYAN },
          },
          "& .MuiInputBase-input": { color: "#0f172a" },
          "& .MuiFormHelperText-root": { color: "#64748b" },
          "& .MuiInputAdornment-root .MuiSvgIcon-root": { color: "#94a3b8" },
        },
      },
    },

    // ── Chip ───────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: "0.75rem" },
        filled: {
          "&.MuiChip-colorDefault": {
            background: "#f1f5f9",
            color: "#475569",
          },
          "&.MuiChip-colorPrimary": {
            background: cyanAlpha(0.12),
            color: CYAN_DARK,
            border: `1px solid ${cyanAlpha(0.2)}`,
          },
          "&.MuiChip-colorSuccess": {
            background: "rgba(5,150,105,0.1)",
            color: "#047857",
            border: "1px solid rgba(5,150,105,0.2)",
          },
          "&.MuiChip-colorWarning": {
            background: "rgba(217,119,6,0.1)",
            color: "#b45309",
            border: "1px solid rgba(217,119,6,0.2)",
          },
          "&.MuiChip-colorError": {
            background: "rgba(220,38,38,0.08)",
            color: "#991b1b",
            border: "1px solid rgba(220,38,38,0.18)",
          },
        },
        outlined: {
          borderColor: "rgba(0,0,0,0.15)",
          "&.MuiChip-colorPrimary": { borderColor: cyanAlpha(0.45), color: CYAN },
          "&.MuiChip-colorSuccess": { borderColor: "rgba(5,150,105,0.4)", color: "#059669" },
          "&.MuiChip-colorWarning": { borderColor: "rgba(217,119,6,0.4)", color: "#d97706" },
          "&.MuiChip-colorError":   { borderColor: "rgba(220,38,38,0.4)", color: "#dc2626" },
        },
      },
    },

    // ── Table ──────────────────────────────────────────────────────
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            fontWeight: 700,
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: CYAN_DARK,
            backgroundColor: cyanAlpha(0.04),
            borderBottom: `1px solid ${cyanAlpha(0.15)}`,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: { root: { borderBottom: "1px solid rgba(0,0,0,0.06)" } },
    },
    MuiTableRow: {
      styleOverrides: { root: { "&:hover": { background: cyanAlpha(0.03) } } },
    },

    // ── Alert ──────────────────────────────────────────────────────
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, border: "1px solid" },
        standardSuccess: { background: "rgba(5,150,105,0.07)",  borderColor: "rgba(5,150,105,0.2)" },
        standardError:   { background: "rgba(220,38,38,0.07)",  borderColor: "rgba(220,38,38,0.18)" },
        standardWarning: { background: "rgba(217,119,6,0.07)",  borderColor: "rgba(217,119,6,0.2)" },
        standardInfo:    { background: cyanAlpha(0.07),          borderColor: cyanAlpha(0.2) },
      },
    },

    // ── Progress ───────────────────────────────────────────────────
    MuiLinearProgress: {
      styleOverrides: {
        root: { background: cyanAlpha(0.1), borderRadius: 4 },
        bar:  { background: `linear-gradient(90deg, ${CYAN_LIGHT}, ${CYAN})`, borderRadius: 4 },
      },
    },

    // ── Tabs ───────────────────────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: `linear-gradient(90deg, ${CYAN_LIGHT}, ${CYAN})`,
          height: 2,
          borderRadius: 2,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#64748b",
          fontWeight: 600,
          "&.Mui-selected": { color: CYAN },
        },
      },
    },

    // ── Misc ───────────────────────────────────────────────────────
    MuiDivider:  { styleOverrides: { root: { borderColor: "rgba(0,0,0,0.08)" } } },
    MuiAvatar: {
      styleOverrides: {
        colorDefault: {
          background: `linear-gradient(135deg, ${CYAN_LIGHT}, ${CYAN})`,
          color: "#ffffff",
          fontWeight: 700,
          boxShadow: `0 0 16px ${cyanAlpha(0.35)}`,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#64748b",
          "&:hover": { background: cyanAlpha(0.08), color: CYAN },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          "& .MuiStepIcon-root": {
            color: "#e2e8f0",
            "&.Mui-active": { color: CYAN },
            "&.Mui-completed": { color: "#059669" },
          },
          "& .MuiStepLabel-label": {
            color: "#64748b",
            "&.Mui-active": { color: CYAN },
            "&.Mui-completed": { color: "#059669" },
          },
          "& .MuiStepConnector-line": { borderColor: "#e2e8f0" },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: "2px 4px",
          "&:hover": { background: cyanAlpha(0.07) },
          "&.Mui-selected": { background: cyanAlpha(0.1), color: CYAN },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "#ffffff",
          border: "none",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&.Mui-selected": {
            background: cyanAlpha(0.1),
            color: CYAN,
            "&:hover": { background: cyanAlpha(0.14) },
          },
          "&:hover": { background: cyanAlpha(0.06) },
        },
      },
    },
  },
});

export default theme;
