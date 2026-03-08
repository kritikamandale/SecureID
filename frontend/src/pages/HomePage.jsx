import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  Grid,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ShieldIcon from "@mui/icons-material/Shield";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SecurityIcon from "@mui/icons-material/Security";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: <AssignmentTurnedInIcon sx={{ fontSize: 28 }} />,
    title: "KYC Verification",
    description:
      "Instant Aadhaar and student ID verification with AI-powered document analysis. No manual review needed.",
    color: "#5C6BC0",
  },
  {
    icon: <FaceRetouchingNaturalIcon sx={{ fontSize: 28 }} />,
    title: "Facial Authentication",
    description:
      "State-of-the-art face recognition with live confidence scoring. Verify identity in under 2 seconds.",
    color: "#7C4DFF",
  },
  {
    icon: <QrCode2Icon sx={{ fontSize: 28 }} />,
    title: "Digital Student ID",
    description:
      "Every verified student gets a secure digital ID with QR code — scannable, tamper-proof, and always accessible.",
    color: "#00BCD4",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 28 }} />,
    title: "Audit Trail",
    description:
      "Every verification attempt is logged with timestamps and confidence scores for full auditability.",
    color: "#00C853",
  },
  {
    icon: <AutoGraphIcon sx={{ fontSize: 28 }} />,
    title: "Real-time Analytics",
    description:
      "Admins get live dashboards with student stats, auth attempts, and system health at a glance.",
    color: "#FF7043",
  },
  {
    icon: <ShieldIcon sx={{ fontSize: 28 }} />,
    title: "Enterprise Security",
    description:
      "JWT-based authentication, encrypted embeddings, and zero-trust architecture across all services.",
    color: "#EC407A",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Account",
    description:
      "Sign up with your name, email, and a secure password. Takes 30 seconds.",
  },
  {
    number: "02",
    title: "Complete KYC",
    description:
      "Upload your Aadhaar number and student ID card for instant AI verification.",
  },
  {
    number: "03",
    title: "Enroll Your Face",
    description:
      "Capture a selfie to enroll your biometric identity securely in our system.",
  },
  {
    number: "04",
    title: "Verify & Get ID",
    description:
      "Authenticate with a live selfie and receive your Digital Student ID with QR code.",
  },
];

export default function HomePage() {
  const { isLoggedIn } = useAuth();

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(160deg, #EEF0FB 0%, #F4F6FF 40%, #EAF4FF 100%)",
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <Box
          sx={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,77,255,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(92,107,192,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", maxWidth: 720, mx: "auto" }}>
            <Chip
              label="🚀 AI-Powered Identity Verification"
              size="small"
              sx={{
                mb: 3,
                bgcolor: "rgba(92,107,192,0.12)",
                color: "primary.dark",
                fontWeight: 700,
                border: "1px solid rgba(92,107,192,0.25)",
                px: 1,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "2.2rem", md: "3.5rem" },
                lineHeight: 1.15,
                mb: 2.5,
                background:
                  "linear-gradient(135deg, #1A1F36 0%, #5C6BC0 50%, #7C4DFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Secure Student Identity, <br />
              Verified by AI
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                fontWeight: 400,
                lineHeight: 1.7,
                mb: 4,
                maxWidth: 560,
                mx: "auto",
              }}
            >
              SECUREID uses facial recognition and KYC verification to give
              every student a tamper-proof digital identity — complete with QR
              code and audit trail.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                component={RouterLink}
                to={isLoggedIn ? "/dashboard" : "/register"}
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ px: 4, py: 1.5, fontSize: "1rem" }}
              >
                {isLoggedIn ? "Go to Dashboard" : "Get Started — Free"}
              </Button>
              {!isLoggedIn && (
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    borderRadius: "10px",
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>

            {/* Stats row */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: { xs: 3, md: 6 },
                mt: 6,
                flexWrap: "wrap",
              }}
            >
              {[
                { value: "< 2s", label: "Verification Time" },
                { value: "99.7%", label: "AI Accuracy" },
                { value: "100%", label: "Audit Coverage" },
              ].map((stat) => (
                <Box key={stat.label} sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    fontWeight={900}
                    color="primary.main"
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Chip
              label="Features"
              size="small"
              sx={{
                mb: 2,
                bgcolor: "rgba(92,107,192,0.1)",
                color: "primary.dark",
                fontWeight: 700,
              }}
            />
            <Typography variant="h3" fontWeight={800} color="text.primary">
              Everything you need for secure identity
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 2, maxWidth: 500, mx: "auto" }}
            >
              A complete platform built for institutions that demand
              reliability, security, and transparency.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {features.map((f) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.title}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "transform 0.25s, box-shadow 0.25s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 12px 40px rgba(92,107,192,0.18)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: `${f.color}18`,
                        color: f.color,
                        width: 52,
                        height: 52,
                        mb: 2,
                        borderRadius: 2.5,
                      }}
                    >
                      {f.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} mb={1}>
                      {f.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      lineHeight={1.7}
                    >
                      {f.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: "linear-gradient(180deg, #F4F6FB 0%, #EEF0FB 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Chip
              label="How It Works"
              size="small"
              sx={{
                mb: 2,
                bgcolor: "rgba(92,107,192,0.1)",
                color: "primary.dark",
                fontWeight: 700,
              }}
            />
            <Typography variant="h3" fontWeight={800}>
              Verified in 4 simple steps
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {steps.map((s, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.number}>
                <Box sx={{ textAlign: "center", px: 2 }}>
                  <Typography
                    variant="h2"
                    fontWeight={900}
                    sx={{
                      background:
                        i % 2 === 0
                          ? "linear-gradient(135deg, #5C6BC0, #7C4DFF)"
                          : "linear-gradient(135deg, #7C4DFF, #EC407A)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1.5,
                      lineHeight: 1,
                    }}
                  >
                    {s.number}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} mb={1}>
                    {s.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    lineHeight={1.7}
                  >
                    {s.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Banner */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: "linear-gradient(135deg, #5C6BC0 0%, #7C4DFF 100%)",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={800} color="#fff" mb={2}>
            Ready to get verified?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255,255,255,0.8)",
              mb: 4,
              maxWidth: 480,
              mx: "auto",
            }}
          >
            Join thousands of students with a secure, AI-verified digital
            identity.
          </Typography>
          <Button
            component={RouterLink}
            to={isLoggedIn ? "/dashboard" : "/register"}
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: "#fff",
              color: "primary.dark",
              fontWeight: 700,
              px: 5,
              py: 1.5,
              fontSize: "1rem",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.92)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              },
            }}
          >
            {isLoggedIn ? "Go to Dashboard" : "Create Free Account"}
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 4,
          textAlign: "center",
          bgcolor: "#fff",
          borderTop: "1px solid rgba(92,107,192,0.1)",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2026 SECUREID — AI-Powered Student Identity Verification Platform
        </Typography>
      </Box>
    </Box>
  );
}
