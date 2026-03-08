import { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
  Paper,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ShieldIcon from "@mui/icons-material/Shield";
import { authApi } from "../services/api";

export default function SignUp() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    student_id: "",
    university: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleRoleChange = (e, newValue) => setRole(newValue);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = { ...form, role };
      // Simulate validation wait
      await new Promise((r) => setTimeout(r, 500));

      const res = await authApi.register(payload);

      localStorage.setItem("secureid_student_id", res.data.id);
      localStorage.setItem("secureid_user_name", form.full_name);
      localStorage.setItem("secureid_user_email", form.email);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      const detail = err.response?.data?.detail;
      let errorMsg = "Registration failed.";
      if (Array.isArray(detail)) {
        // FastAPI 422 returns an array of validation error objects
        errorMsg = detail.map((e) => e.msg || JSON.stringify(e)).join("; ");
      } else if (typeof detail === "string") {
        errorMsg = detail;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #EEF0FB 0%, #F4F6FF 50%, #EAF0FF 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, md: 4 },
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 650,
          boxShadow: "0 8px 40px rgba(92,107,192,0.15)",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "16px",
                background: "linear-gradient(135deg, #5C6BC0 0%, #7C4DFF 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(92,107,192,0.4)",
                mb: 2,
              }}
            >
              <ShieldIcon sx={{ fontSize: 28, color: "#fff" }} />
            </Box>
            <Typography
              variant="h5"
              fontWeight={800}
              color="text.primary"
              align="center"
            >
              Create Account
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 0.5 }}
            >
              Join SecureVault Student Identity System
            </Typography>
          </Box>

          <Tabs
            value={role}
            onChange={handleRoleChange}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Student" value="student" sx={{ fontWeight: 600 }} />
            <Tab label="Admin" value="admin" sx={{ fontWeight: 600 }} />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              name="full_name"
              label="Full Name"
              type="text"
              required
              fullWidth
              value={form.full_name}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {role === "student" && (
              <>
                <TextField
                  name="student_id"
                  label="Student ID"
                  type="text"
                  required
                  fullWidth
                  value={form.student_id}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  name="university"
                  label="University"
                  type="text"
                  required
                  fullWidth
                  value={form.university}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SchoolIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}

            <TextField
              name="email"
              label="Email Address"
              type="email"
              required
              fullWidth
              value={form.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              name="password"
              label="Password"
              type={showPass ? "text" : "password"}
              required
              fullWidth
              inputProps={{ minLength: 8 }}
              value={form.password}
              onChange={handleChange}
              helperText="Min. 8 characters"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 1, py: 1.4, fontSize: "0.95rem" }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                `Register as ${role === "student" ? "Student" : "Admin"}`
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Already registered?
            </Typography>
          </Divider>

          <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            fullWidth
            sx={{ borderRadius: 2.5, fontWeight: 600 }}
          >
            Sign In Instead
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
