import { useState } from "react";
import {
  Link as RouterLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
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
  const { isLoggedIn, logout, userName, userRole } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate("/");
    handleMenuClose();
    setDrawerOpen(false);
  };

  const navLinks = [
    { label: "Home", to: "/" },
    ...(isLoggedIn ? [{ label: "Dashboard", to: "/dashboard" }] : []),
    ...(isLoggedIn && userRole !== "admin" ? [{ label: "Profile", to: "/profile" }] : []),
    ...(isLoggedIn && userRole === "admin" ? [{ label: "Admin", to: "/admin" }] : []),
  ];

  const mobileDrawer = (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      PaperProps={{ sx: { width: 240, pt: 2, bgcolor: "#121C2E" } }}
    >
      <Box sx={{ px: 2, pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            background: "linear-gradient(135deg, #00D9C0 0%, #00a592 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)",
          }}
        >
          <ShieldIcon sx={{ fontSize: 18, color: "#0B1220" }} />
        </Box>
        <Typography variant="h6" fontWeight={700} fontSize="1rem" className="nav-brand-text">
          SECUREID
        </Typography>
      </Box>
      <Divider sx={{ mb: 1, borderColor: "rgba(237, 242, 247, 0.08)" }} />
      <List disablePadding>
        {navLinks.map((link) => (
          <ListItem key={link.to} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={link.to}
              onClick={() => setDrawerOpen(false)}
              selected={pathname === link.to}
              sx={{
                mx: 1,
                borderRadius: 0,
                borderLeft: pathname === link.to ? "2px solid #00D9C0" : "2px solid transparent",
                "&.Mui-selected": {
                  bgcolor: "rgba(0, 217, 192, 0.1)",
                  color: "#00D9C0",
                  fontWeight: 700,
                },
              }}
            >
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{ fontWeight: pathname === link.to ? 700 : 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1, borderColor: "rgba(237, 242, 247, 0.08)" }} />
      <List disablePadding>
        {!isLoggedIn ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/login"
                onClick={() => setDrawerOpen(false)}
                sx={{ mx: 1 }}
              >
                <ListItemText primary="Sign In" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <Box sx={{ px: 2, pt: 1, width: "100%" }}>
                <RouterLink
                  to="/register"
                  className="sid-btn-bracket"
                  onClick={() => setDrawerOpen(false)}
                  style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem", padding: "10px 16px" }}
                >
                  Get Started
                </RouterLink>
              </Box>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton disabled sx={{ mx: 1 }}>
                <ListItemText
                  primary={userName || "Student"}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: "0.85rem", color: "text.primary" }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{ mx: 1, color: "error.main" }}
              >
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{ color: "error.main", fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: "rgba(11, 18, 32, 0.9)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(237, 242, 247, 0.08)",
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
                gap: 10,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  background: "linear-gradient(135deg, #00D9C0 0%, #00a592 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
                  boxShadow: "0 4px 12px rgba(0,217,192,0.35)",
                }}
              >
                <ShieldIcon sx={{ fontSize: 20, color: "#0B1220" }} />
              </Box>
              <Typography
                variant="h6"
                fontWeight={700}
                className="nav-brand-text"
                sx={{ color: "text.primary" }}
              >
                SECUREID
              </Typography>
            </RouterLink>

            <Box sx={{ flex: 1 }} />

            {/* Desktop Links: Plain text with thin hover underline, NO pill backgrounds */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 2,
              }}
            >
              {navLinks.map((link) => (
                <RouterLink
                  key={link.to}
                  to={link.to}
                  className={`sid-nav-link ${pathname === link.to ? "active" : ""}`}
                >
                  {link.label}
                </RouterLink>
              ))}
            </Box>

            <Box
              sx={{
                ml: 3,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 2,
              }}
            >
              {!isLoggedIn ? (
                <>
                  <RouterLink
                    to="/login"
                    className="sid-nav-link"
                    style={{ fontSize: "0.9rem", fontWeight: 600 }}
                  >
                    Sign In
                  </RouterLink>
                  {/* Bracket-cut CTA button — square corners with diagonal cut corner */}
                  <RouterLink
                    to="/register"
                    className="sid-btn-bracket"
                  >
                    Get Started
                  </RouterLink>
                </>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      cursor: "pointer",
                      background: "linear-gradient(135deg, #00D9C0 0%, #00a592 100%)",
                      color: "#0B1220",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)",
                    }}
                    onClick={handleMenuOpen}
                  >
                    {userName ? userName[0].toUpperCase() : "S"}
                  </Avatar>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{ sx: { borderRadius: 0, mt: 1, minWidth: 160, bgcolor: "#121C2E", border: "1px solid rgba(237, 242, 247, 0.08)" } }}
                  >
                    <MenuItem disabled sx={{ opacity: 0.9 }}>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
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
                    <MenuItem
                      onClick={() => {
                        navigate("/profile");
                        handleMenuClose();
                      }}
                    >
                      Profile &amp; Settings
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
              sx={{ display: { xs: "flex", md: "none" }, ml: 1, color: "text.primary" }}
              onClick={handleDrawerToggle}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {mobileDrawer}
    </>
  );
}
