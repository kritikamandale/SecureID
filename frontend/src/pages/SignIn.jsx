import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
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
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ShieldIcon from "@mui/icons-material/Shield";
import { authApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login(form);
      const {
        access_token,
        student_id,
        name,
        email,
        kyc_status,
        face_registered,
      } = res.data;

      let role = "student";
      try {
        const decoded = jwtDecode(access_token);
        role = decoded.role || "student";
      } catch (e) {}

      login({
        access_token,
        student_id: String(student_id),
        name: name || form.email.split("@")[0],
        email: email || form.email,
      });

      if (role === "admin") {
        navigate("/admin");
      } else if (kyc_status === "verified" && face_registered) {
        navigate("/dashboard");
      } else {
        navigate("/verify");
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        Array.isArray(detail)
          ? detail.map((e) => e.msg || JSON.stringify(e)).join("; ")
          : detail || "Invalid email or password",
      );
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
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 8px 40px rgba(92,107,192,0.15)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3.5,
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
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 0.5 }}
            >
              Sign in to your SECUREID account
            </Typography>
          </Box>

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
              name="email"
              label="Email Address"
              type="email"
              required
              fullWidth
              value={form.email}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              name="password"
              label="Password"
              type={showPass ? "text" : "password"}
              required
              fullWidth
              value={form.password}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
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
                },
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
                "Sign In"
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" color="text.secondary">
              New to SECUREID?
            </Typography>
          </Divider>

          <Button
            component={RouterLink}
            to="/register"
            variant="outlined"
            fullWidth
            sx={{ borderRadius: 2.5, fontWeight: 600 }}
          >
            Create Account
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
