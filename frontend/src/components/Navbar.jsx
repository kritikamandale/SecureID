import { useState } from "react";
import {
  Link as RouterLink,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  useScrollTrigger,
  Slide,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShieldIcon from "@mui/icons-material/Shield";
import { useAuth } from "../context/AuthContext";

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Navbar() {
  const { isLoggedIn, logout, userName } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    handleMenuClose();
  };

  const navLinkSx = (path) => ({
    color: pathname === path ? "primary.main" : "text.secondary",
    fontWeight: pathname === path ? 700 : 500,
    fontSize: "0.875rem",
    px: 1.5,
    py: 0.75,
    borderRadius: 2,
    bgcolor: pathname === path ? "rgba(92,107,192,0.1)" : "transparent",
    textDecoration: "none",
    transition: "all 0.2s",
    "&:hover": { bgcolor: "rgba(92,107,192,0.08)", color: "primary.main" },
  });

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(92,107,192,0.12)",
          color: "text.primary",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: "lg",
            width: "100%",
            mx: "auto",
            px: { xs: 2, md: 4 },
          }}
        >
          {/* Logo */}
          <RouterLink
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #5C6BC0 0%, #7C4DFF 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(92,107,192,0.4)",
              }}
            >
              <ShieldIcon sx={{ fontSize: 20, color: "#fff" }} />
            </Box>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{ color: "text.primary", letterSpacing: "-0.02em" }}
            >
              SECUREID
            </Typography>
          </RouterLink>

          <Box sx={{ flex: 1 }} />

          {/* Desktop Links */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Button component={RouterLink} to="/" sx={navLinkSx("/")}>
              Home
            </Button>
            {isLoggedIn && (
              <Button
                component={RouterLink}
                to="/dashboard"
                sx={navLinkSx("/dashboard")}
              >
                Dashboard
              </Button>
            )}
            {isLoggedIn && (
              <Button
                component={RouterLink}
                to="/admin"
                sx={navLinkSx("/admin")}
              >
                Admin
              </Button>
            )}
          </Box>

          <Box
            sx={{
              ml: 2,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {!isLoggedIn ? (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                  Sign In
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    cursor: "pointer",
                    background:
                      "linear-gradient(135deg, #5C6BC0 0%, #7C4DFF 100%)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                  }}
                  onClick={handleMenuOpen}
                >
                  {userName ? userName[0].toUpperCase() : "S"}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{ sx: { borderRadius: 2, mt: 1, minWidth: 160 } }}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" fontWeight={600}>
                      {userName || "Student"}
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/dashboard");
                      handleMenuClose();
                    }}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>

          {/* Mobile hamburger */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, ml: 1 }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}
