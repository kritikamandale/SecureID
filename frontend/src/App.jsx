import { Routes, Route, Navigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Chip,
  Stepper,
  Step,
  Grid,
  StepLabel,
  Divider,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import KYCUpload from "./pages/KYCUpload";
import FaceEnroll from "./pages/FaceEnroll";
import FaceAuth from "./pages/FaceAuth";
import StudentIDCard from "./components/StudentIDCard";
import Timeline from "./components/Timeline";
import StudentDashboard from "./pages/StudentDashboard";
import StudentVerificationHistory from "./pages/StudentVerificationHistory";
import React from "react";
import { studentApi } from "./services/api";

// Admin
import Dashboard from "./pages/admin/Dashboard";
import StudentList from "./pages/admin/StudentList";
import AuthLogs from "./pages/admin/AuthLogs";
import AdminPortal from "./pages/admin/AdminPortal";

// ─────────────────────────────────────────────────────────────
// Verification Flow (The original StudentDashboard)
// ─────────────────────────────────────────────────────────────
function VerificationFlow() {
  const { userName, userEmail, studentId } = useAuth();
  const [timeline, setTimeline] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchTimeline = React.useCallback(() => {
    studentApi
      .getTimeline()
      .then((res) => {
        setTimeline(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  const refreshTimeline = React.useCallback(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  const hasKyc = timeline.some((t) => t.type === "kyc");
  const hasEnroll = timeline.some((t) => t.type === "face_enrollment");
  const hasAuth = timeline.some(
    (t) => t.type === "authentication" && t.title.includes("Success"),
  );

  const activeStep = hasAuth ? 4 : hasEnroll ? 3 : hasKyc ? 2 : 1;

  if (loading)
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      <Container maxWidth="lg" sx={{ pt: 5 }}>
        {/* Welcome header */}
        <Box sx={{ mb: 4 }}>
          <Chip
            label="Verification Portal"
            size="small"
            sx={{
              mb: 1.5,
              bgcolor: "rgba(92,107,192,0.1)",
              color: "primary.dark",
              fontWeight: 700,
            }}
          />
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Complete Verification, {userName || "Student"}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  Your Journey
                </Typography>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {[
                    "Register",
                    "KYC",
                    "Face Enroll",
                    "Face Auth",
                    "Dashboard",
                  ].map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>

            <Box
              sx={{
                mb: 3,
                opacity: activeStep >= 1 ? 1 : 0.5,
                pointerEvents: activeStep >= 1 ? "auto" : "none",
              }}
            >
              <KYCUpload onComplete={refreshTimeline} />
              {activeStep < 1 && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Please complete Registration first.
                </Alert>
              )}
            </Box>

            <Box
              sx={{
                mb: 3,
                opacity: activeStep >= 2 ? 1 : 0.5,
                pointerEvents: activeStep >= 2 ? "auto" : "none",
              }}
            >
              <FaceEnroll onComplete={refreshTimeline} />
              {activeStep < 2 && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Please complete KYC first to unlock Face Enrollment.
                </Alert>
              )}
            </Box>

            <Box
              sx={{
                opacity: activeStep >= 3 ? 1 : 0.5,
                pointerEvents: activeStep >= 3 ? "auto" : "none",
              }}
            >
              <FaceAuth onComplete={refreshTimeline} />
              {activeStep < 3 && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Please complete Face Enrollment first to unlock Face
                  Authentication.
                </Alert>
              )}
              {activeStep >= 4 && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  Authentication Successful! You can now view your dashboard.
                </Alert>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                position: "sticky",
                top: 90,
              }}
            >
              <Timeline timelineData={timeline} />
              <Button
                component={RouterLink}
                to="/dashboard"
                variant="contained"
                disabled={activeStep < 4}
                fullWidth
                sx={{ py: 1.5 }}
              >
                View Final Dashboard
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// Note: AdminLayout has been replaced by AdminPortal

// ─────────────────────────────────────────────────────────────
// Root App
// ─────────────────────────────────────────────────────────────
export default function App() {
  const { userRole } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {userRole === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <StudentDashboard />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <ProtectedRoute>
                {userRole === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <VerificationFlow />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/verification-history"
            element={
              <ProtectedRoute>
                {userRole === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <StudentVerificationHistory />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                {userRole === "admin" ? (
                  <AdminPortal />
                ) : (
                  <Navigate to="/dashboard" replace />
                )}
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
}
