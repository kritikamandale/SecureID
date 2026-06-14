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
  Button,
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

  const navLinkSx = (path) => ({
    color: pathname === path ? "primary.main" : "text.secondary",
    fontWeight: pathname === path ? 700 : 500,
    fontSize: "0.875rem",
    px: 1.5,
    py: 0.75,
    borderRadius: 2,
    bgcolor: pathname === path ? "rgba(34,211,238,0.1)" : "transparent",
    textDecoration: "none",
    transition: "all 0.2s",
    "&:hover": { bgcolor: "rgba(34,211,238,0.08)", color: "primary.main" },
  });

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
      PaperProps={{ sx: { width: 240, pt: 2 } }}
    >
      <Box sx={{ px: 2, pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShieldIcon sx={{ fontSize: 18, color: "#fff" }} />
        </Box>
        <Typography variant="h6" fontWeight={700} fontSize="1rem" className="nav-brand-text">
          SECUREID
        </Typography>
      </Box>
      <Divider sx={{ mb: 1 }} />
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
                borderRadius: 2,
                "&.Mui-selected": {
                  bgcolor: "rgba(34,211,238,0.1)",
                  color: "primary.main",
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
      <Divider sx={{ my: 1 }} />
      <List disablePadding>
        {!isLoggedIn ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/login"
                onClick={() => setDrawerOpen(false)}
                sx={{ mx: 1, borderRadius: 2 }}
              >
                <ListItemText primary="Sign In" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={RouterLink}
                to="/register"
                onClick={() => setDrawerOpen(false)}
                sx={{ mx: 1, borderRadius: 2, color: "primary.main", fontWeight: 700 }}
              >
                <ListItemText
                  primary="Get Started"
                  primaryTypographyProps={{ fontWeight: 700, color: "primary.main" }}
                />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton disabled sx={{ mx: 1, borderRadius: 2 }}>
                <ListItemText
                  primary={userName || "Student"}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: "0.85rem" }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{ mx: 1, borderRadius: 2, color: "error.main" }}
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
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(8,145,178,0.1)",
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
                  background: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(34,211,238,0.35)",
                }}
              >
                <ShieldIcon sx={{ fontSize: 20, color: "#fff" }} />
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

            {/* Desktop Links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  sx={navLinkSx(link.to)}
                >
                  {link.label}
                </Button>
              ))}
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
                        "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
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
              sx={{ display: { xs: "flex", md: "none" }, ml: 1 }}
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
