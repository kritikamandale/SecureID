import { createTheme } from "@mui/material/styles";

// ── SecureID Design Tokens ───────────────────────────────────────────
const NAVY = "#0B1220";
const NAVY_RAISED = "#121C2E";
const CYAN = "#00D9C0";
const CYAN_LIGHT = "#4DFFE9";
const CYAN_DARK = "#00a592";
const AMBER = "#F5A623";
const TEXT_PRIMARY = "#EDF2F7";
const TEXT_SECONDARY = "#8B98AC";
const BORDER_HAIRLINE = "rgba(237, 242, 247, 0.08)";

const cyanAlpha = (alpha) => `rgba(0, 217, 192, ${alpha})`;

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: CYAN,
      light: CYAN_LIGHT,
      dark: CYAN_DARK,
      contrastText: "#0B1220",
    },
    secondary: {
      main: AMBER,
      light: "#ffc86b",
      dark: "#c27c0e",
      contrastText: "#0B1220",
    },
    success: { main: "#10b981", light: "#34d399", dark: "#059669", contrastText: "#0B1220" },
    warning: { main: AMBER, light: "#fbbf24", dark: "#d97706", contrastText: "#0B1220" },
    error:   { main: "#ef4444", light: "#f87171", dark: "#b91c1c", contrastText: "#ffffff" },
    background: {
      default: NAVY,
      paper: NAVY_RAISED,
    },
    text: {
      primary:   TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
      disabled:  "rgba(237, 242, 247, 0.4)",
    },
    divider: BORDER_HAIRLINE,
    action: {
      hover:             cyanAlpha(0.08),
      selected:          cyanAlpha(0.14),
      disabled:          "rgba(237, 242, 247, 0.3)",
      disabledBackground:"rgba(237, 242, 247, 0.06)",
    },
  },

  typography: {
    fontFamily: '"DM Sans", "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", "Outfit", "DM Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontFamily: '"Space Grotesk", "Outfit", "DM Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontFamily: '"Space Grotesk", "Outfit", "DM Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontFamily: '"Space Grotesk", "Outfit", "DM Sans", sans-serif',
      fontWeight: 700,
      letterSpacing: "0em",
    },
    h5: {
      fontFamily: '"Space Grotesk", "Outfit", "DM Sans", sans-serif',
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
    h6: {
      fontFamily: '"Space Grotesk", "Outfit", "DM Sans", sans-serif',
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
    button: {
      fontFamily: '"Space Grotesk", "DM Sans", sans-serif',
      fontWeight: 700,
      textTransform: "none",
      letterSpacing: "0.02em",
    },
    overline: {
      fontFamily: '"JetBrains Mono", "Space Grotesk", sans-serif',
      letterSpacing: "0.16em",
      fontWeight: 600,
    },
  },

  shape: { borderRadius: 12 },

  components: {
    // ── Card ───────────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          background: NAVY_RAISED,
          border: `1px solid ${BORDER_HAIRLINE}`,
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          backgroundImage: "none",
          transition: "border-color 0.25s, box-shadow 0.25s, transform 0.25s",
          "&:hover": {
            borderColor: cyanAlpha(0.35),
            boxShadow: `0 8px 32px ${cyanAlpha(0.12)}, 0 0 0 1px ${cyanAlpha(0.08)}`,
          },
        },
      },
    },

    // ── Paper ──────────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          background: NAVY_RAISED,
          border: `1px solid ${BORDER_HAIRLINE}`,
          borderRadius: 14,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          backgroundImage: "none",
        },
        elevation0: { boxShadow: "none", border: "none" },
      },
    },

    // ── AppBar ─────────────────────────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(11, 18, 32, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${BORDER_HAIRLINE}`,
          boxShadow: "none",
          color: TEXT_PRIMARY,
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
          background: `linear-gradient(135deg, ${CYAN} 0%, ${CYAN_DARK} 100%)`,
          color: "#0B1220",
          boxShadow: `0 4px 16px ${cyanAlpha(0.35)}`,
          "&:hover": {
            background: `linear-gradient(135deg, ${CYAN_LIGHT} 0%, ${CYAN} 100%)`,
            boxShadow: `0 8px 28px ${cyanAlpha(0.5)}`,
            transform: "translateY(-2px)",
          },
          "&.Mui-disabled": {
            background: "rgba(237, 242, 247, 0.08)",
            color: "rgba(237, 242, 247, 0.3)",
          },
        },
        outlinedPrimary: {
          borderColor: cyanAlpha(0.4),
          color: CYAN,
          "&:hover": {
            borderColor: CYAN,
            background: cyanAlpha(0.08),
            boxShadow: `0 4px 16px ${cyanAlpha(0.15)}`,
          },
        },
        outlinedInherit: {
          borderColor: BORDER_HAIRLINE,
          color: TEXT_PRIMARY,
          "&:hover": { borderColor: cyanAlpha(0.3), background: "rgba(237, 242, 247, 0.04)" },
        },
        text: {
          color: CYAN,
          "&:hover": { background: cyanAlpha(0.08) },
        },
      },
    },

    // ── TextField ──────────────────────────────────────────────────
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            background: NAVY,
            color: TEXT_PRIMARY,
            "& fieldset": { borderColor: BORDER_HAIRLINE },
            "&:hover fieldset": { borderColor: cyanAlpha(0.4) },
            "&.Mui-focused fieldset": { borderColor: CYAN, borderWidth: 1.5 },
          },
          "& .MuiInputLabel-root": {
            color: TEXT_SECONDARY,
            "&.Mui-focused": { color: CYAN },
          },
          "& .MuiInputBase-input": { color: TEXT_PRIMARY },
          "& .MuiFormHelperText-root": { color: TEXT_SECONDARY },
          "& .MuiInputAdornment-root .MuiSvgIcon-root": { color: TEXT_SECONDARY },
        },
      },
    },

    // ── Chip ───────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: "0.75rem" },
        filled: {
          "&.MuiChip-colorDefault": {
            background: "rgba(237, 242, 247, 0.08)",
            color: TEXT_PRIMARY,
          },
          "&.MuiChip-colorPrimary": {
            background: cyanAlpha(0.12),
            color: CYAN,
            border: `1px solid ${cyanAlpha(0.25)}`,
          },
          "&.MuiChip-colorSuccess": {
            background: "rgba(16, 185, 129, 0.12)",
            color: "#34d399",
            border: "1px solid rgba(16, 185, 129, 0.25)",
          },
          "&.MuiChip-colorWarning": {
            background: "rgba(245, 166, 35, 0.12)",
            color: AMBER,
            border: "1px solid rgba(245, 166, 35, 0.25)",
          },
          "&.MuiChip-colorError": {
            background: "rgba(239, 68, 68, 0.12)",
            color: "#f87171",
            border: "1px solid rgba(239, 68, 68, 0.25)",
          },
        },
        outlined: {
          borderColor: BORDER_HAIRLINE,
          "&.MuiChip-colorPrimary": { borderColor: cyanAlpha(0.45), color: CYAN },
          "&.MuiChip-colorSuccess": { borderColor: "rgba(16, 185, 129, 0.4)", color: "#34d399" },
          "&.MuiChip-colorWarning": { borderColor: "rgba(245, 166, 35, 0.4)", color: AMBER },
          "&.MuiChip-colorError":   { borderColor: "rgba(239, 68, 68, 0.4)", color: "#f87171" },
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
            color: CYAN,
            backgroundColor: cyanAlpha(0.04),
            borderBottom: `1px solid ${BORDER_HAIRLINE}`,
            fontFamily: '"Space Grotesk", sans-serif',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: { root: { borderBottom: `1px solid ${BORDER_HAIRLINE}`, color: TEXT_PRIMARY } },
    },
    MuiTableRow: {
      styleOverrides: { root: { "&:hover": { background: cyanAlpha(0.04) } } },
    },

    // ── Alert ──────────────────────────────────────────────────────
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, border: "1px solid" },
        standardSuccess: { background: "rgba(16, 185, 129, 0.1)",  borderColor: "rgba(16, 185, 129, 0.25)", color: "#34d399" },
        standardError:   { background: "rgba(239, 68, 68, 0.1)",   borderColor: "rgba(239, 68, 68, 0.25)",   color: "#f87171" },
        standardWarning: { background: "rgba(245, 166, 35, 0.1)",  borderColor: "rgba(245, 166, 35, 0.25)",  color: AMBER },
        standardInfo:    { background: cyanAlpha(0.1),           borderColor: cyanAlpha(0.25),          color: CYAN },
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
          color: TEXT_SECONDARY,
          fontWeight: 600,
          "&.Mui-selected": { color: CYAN },
        },
      },
    },

    // ── Misc ───────────────────────────────────────────────────────
    MuiDivider:  { styleOverrides: { root: { borderColor: BORDER_HAIRLINE } } },
    MuiAvatar: {
      styleOverrides: {
        colorDefault: {
          background: `linear-gradient(135deg, ${CYAN} 0%, ${CYAN_DARK} 100%)`,
          color: NAVY,
          fontWeight: 700,
          boxShadow: `0 0 16px ${cyanAlpha(0.35)}`,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: TEXT_SECONDARY,
          "&:hover": { background: cyanAlpha(0.1), color: CYAN },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          "& .MuiStepIcon-root": {
            color: "rgba(237, 242, 247, 0.15)",
            "&.Mui-active": { color: CYAN },
            "&.Mui-completed": { color: "#10b981" },
          },
          "& .MuiStepLabel-label": {
            color: TEXT_SECONDARY,
            "&.Mui-active": { color: CYAN, fontWeight: 700 },
            "&.Mui-completed": { color: "#10b981" },
          },
          "& .MuiStepConnector-line": { borderColor: BORDER_HAIRLINE },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: NAVY_RAISED,
          border: `1px solid ${BORDER_HAIRLINE}`,
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: "2px 4px",
          color: TEXT_PRIMARY,
          "&:hover": { background: cyanAlpha(0.1) },
          "&.Mui-selected": { background: cyanAlpha(0.16), color: CYAN },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: NAVY_RAISED,
          borderLeft: `1px solid ${BORDER_HAIRLINE}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          color: TEXT_PRIMARY,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&.Mui-selected": {
            background: cyanAlpha(0.14),
            color: CYAN,
            "&:hover": { background: cyanAlpha(0.18) },
          },
          "&:hover": { background: cyanAlpha(0.08) },
        },
      },
    },
  },
});

export default theme;
