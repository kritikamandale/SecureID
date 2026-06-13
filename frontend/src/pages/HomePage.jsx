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
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ShieldIcon from "@mui/icons-material/Shield";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BadgeIcon from "@mui/icons-material/Badge";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SchoolIcon from "@mui/icons-material/School";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PaymentIcon from "@mui/icons-material/Payment";
import { useAuth } from "../context/AuthContext";

// ── Hero visual (mock verification card) ────────────────────────
function HeroVisual() {
  return (
    <Box sx={{ position: "relative", maxWidth: 400, mx: "auto" }}>
      {/* Glow behind card */}
      <Box sx={{
        position: "absolute",
        inset: -80,
        background: "radial-gradient(circle, rgba(8,145,178,0.14) 0%, transparent 65%)",
        borderRadius: "50%",
        pointerEvents: "none",
      }} />

      {/* Main verification card */}
      <Card className="hero-card-glow" sx={{
        background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
        color: "#fff",
        p: { xs: 3, md: 3.5 },
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 28px 64px rgba(8,145,178,0.38), 0 8px 24px rgba(0,0,0,0.08)",
        border: "none",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 36px 80px rgba(8,145,178,0.45)" },
      }}>
        {/* Decorative circles */}
        <Box sx={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.07)" }} />
        <Box sx={{ position: "absolute", bottom: -40, left: -30, width: 150, height: 150, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.05)" }} />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          {/* Student header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar sx={{
              width: 60, height: 60,
              bgcolor: "rgba(255,255,255,0.2)",
              border: "2px solid rgba(255,255,255,0.4)",
              fontSize: "1.4rem",
              fontWeight: 800,
            }}>P</Avatar>
            <Box>
              <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.58rem", letterSpacing: "0.14em" }}>
                SECUREID — VERIFIED
              </Typography>
              <Typography variant="h6" fontWeight={800} lineHeight={1.2}>Priya Sharma</Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.75)" }}>
                Computer Science · Class of 2026
              </Typography>
            </Box>
          </Box>

          {/* Verified banner */}
          <Box sx={{
            display: "flex", alignItems: "center", gap: 1.5,
            bgcolor: "rgba(255,255,255,0.12)",
            borderRadius: 2, p: 1.5, mb: 3,
            border: "1px solid rgba(255,255,255,0.15)",
          }}>
            <CheckCircleIcon sx={{ color: "#4ade80", fontSize: 22 }} />
            <Typography variant="body2" fontWeight={700}>Identity Verified Successfully</Typography>
          </Box>

          {/* Stats row */}
          <Box sx={{ display: "flex" }}>
            {[
              { value: "98.3%", label: "Confidence" },
              { value: "1.2s",  label: "Scan Time"  },
              { value: "KYC ✓", label: "Approved"   },
            ].map((s, i) => (
              <Box key={s.label} sx={{
                flex: 1, textAlign: "center", py: 0.5,
                borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.18)" : "none",
              }}>
                <Typography variant="h6" fontWeight={900} lineHeight={1.2}>{s.value}</Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.65rem" }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Card>

      {/* Floating chip — top right */}
      <Box sx={{
        position: "absolute", top: -18, right: -10,
        background: "#ffffff",
        border: "1px solid rgba(8,145,178,0.15)",
        borderRadius: "20px",
        px: 2, py: 0.75,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        display: "flex", alignItems: "center", gap: 1,
      }}>
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#22c55e" }} />
        <Typography variant="caption" fontWeight={700} color="text.primary">Face Matched</Typography>
      </Box>

      {/* Floating chip — bottom left */}
      <Box sx={{
        position: "absolute", bottom: -14, left: -8,
        background: "#ffffff",
        border: "1px solid rgba(8,145,178,0.15)",
        borderRadius: "20px",
        px: 2, py: 0.75,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        display: "flex", alignItems: "center", gap: 1,
      }}>
        <Typography sx={{ fontSize: "14px", lineHeight: 1 }}>🔗</Typography>
        <Typography variant="caption" fontWeight={700} color="text.primary">Blockchain Secured</Typography>
      </Box>
    </Box>
  );
}

// ── 3-step feature cards ────────────────────────────────────────
const coreFeatures = [
  {
    icon: <AssignmentTurnedInIcon sx={{ fontSize: 28 }} />,
    color: "#0891b2",
    title: "AI-Powered KYC",
    description: "Submit Aadhaar and student ID. Our AI verifies them in seconds — no manual review, no waiting queues.",
    badge: "Document Verification",
  },
  {
    icon: <FaceRetouchingNaturalIcon sx={{ fontSize: 28 }} />,
    color: "#0e7490",
    title: "Biometric Face Auth",
    description: "99.7% accurate face recognition via DeepFace. Verify your identity in under 2 seconds from any device.",
    badge: "Face Recognition AI",
  },
  {
    icon: <ShieldIcon sx={{ fontSize: 28 }} />,
    color: "#06b6d4",
    title: "Tamper-Proof Digital ID",
    description: "Every verified student receives a QR-coded digital ID backed by an immutable blockchain audit trail.",
    badge: "Blockchain Secured",
  },
];

// ── How It Works steps ───────────────────────────────────────────
const steps = [
  { number: "01", icon: <PersonAddIcon sx={{ fontSize: 32 }} />, title: "Create Account", description: "Sign up in 30 seconds with your name, university email, and student ID." },
  { number: "02", icon: <AssignmentTurnedInIcon sx={{ fontSize: 32 }} />, title: "Complete KYC", description: "Upload your Aadhaar and student ID card. AI verifies them instantly." },
  { number: "03", icon: <CameraAltIcon sx={{ fontSize: 32 }} />, title: "Enroll Your Face", description: "Capture a selfie to register your biometric identity securely." },
  { number: "04", icon: <BadgeIcon sx={{ fontSize: 32 }} />, title: "Get Your Digital ID", description: "Authenticate with a live selfie and receive your verified digital identity." },
];

// ── Use cases ────────────────────────────────────────────────────
const useCases = [
  { icon: <SchoolIcon />,        color: "#0891b2", title: "Exam Hall Entry",    description: "Replace manual ID checks with instant face scan at exam gates. Zero queues, zero impersonation." },
  { icon: <LocalLibraryIcon />,  color: "#0e7490", title: "Library Access",    description: "Students tap in with a selfie. Borrowing history tied to their verified identity automatically." },
  { icon: <MeetingRoomIcon />,   color: "#06b6d4", title: "Hostel Check-in",   description: "Secure hostel gate entry with face recognition — no keys, no cards, no manual sign-ins." },
  { icon: <PaymentIcon />,       color: "#164e63", title: "Fee Payment Auth",  description: "High-value transactions require a live selfie match — preventing fraud at source." },
];

// ── Page ─────────────────────────────────────────────────────────
export default function HomePage() {
  const { isLoggedIn } = useAuth();

  return (
    <Box sx={{ bgcolor: "transparent" }}>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <Box sx={{ pt: { xs: 7, md: 10 }, pb: { xs: 10, md: 14 }, position: "relative", overflow: "hidden" }}>
        {/* Right-panel tint */}
        <Box sx={{
          display: { xs: "none", md: "block" },
          position: "absolute", top: 0, right: 0, bottom: 0, width: "50%",
          background: "linear-gradient(135deg, rgba(8,145,178,0.04) 0%, rgba(34,211,238,0.08) 100%)",
          borderRadius: "0 0 0 120px",
          pointerEvents: "none",
        }} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">

            {/* Left: Text + CTAs */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Chip
                label="🔐 AI Biometric Identity Platform"
                color="primary"
                sx={{ mb: 3, fontWeight: 700, px: 1 }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.4rem", sm: "3rem", md: "3.6rem" },
                  lineHeight: 1.12,
                  mb: 2.5,
                  fontWeight: 900,
                  color: "text.primary",
                }}
              >
                Verify Student Identity.{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Eliminate Impersonation.
                </Box>
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontWeight: 400, lineHeight: 1.75, mb: 4.5, maxWidth: 480 }}
              >
                SECUREID combines face recognition, KYC validation, and blockchain audit trail to give every student a tamper-proof digital identity — in under 2 seconds.
              </Typography>

              {/* CTAs */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 5 }}>
                <Button
                  component={RouterLink}
                  to={isLoggedIn ? "/dashboard" : "/register"}
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ px: 4, py: 1.6, fontSize: "1rem", borderRadius: "12px" }}
                >
                  {isLoggedIn ? "Go to Dashboard" : "Get Verified Free"}
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{ px: 4, py: 1.6, fontSize: "1rem", borderRadius: "12px" }}
                >
                  Sign In
                </Button>
              </Box>

              {/* Trust stats */}
              <Box sx={{ display: "flex", gap: { xs: 3, md: 4 }, flexWrap: "wrap" }}>
                {[
                  { value: "< 2s",  label: "Verification Time" },
                  { value: "99.7%", label: "AI Accuracy"       },
                  { value: "100%",  label: "Audit Coverage"    },
                ].map((stat, i) => (
                  <Box key={stat.label} sx={{ display: "flex", alignItems: "center", gap: { xs: 2, md: 3 } }}>
                    {i > 0 && <Divider orientation="vertical" flexItem sx={{ height: 36, alignSelf: "center" }} />}
                    <Box>
                      <Typography variant="h5" fontWeight={900} color="primary.main" lineHeight={1.1}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Right: Visual */}
            <Grid size={{ xs: 12, md: 6 }}>
              <HeroVisual />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── TRUSTED BY STRIP ────────────────────────────────────── */}
      <Box sx={{
        py: 2.5,
        background: "rgba(8,145,178,0.04)",
        borderTop: "1px solid rgba(8,145,178,0.1)",
        borderBottom: "1px solid rgba(8,145,178,0.1)",
      }}>
        <Container maxWidth="md">
          <Box sx={{ display: "flex", gap: { xs: 3, md: 5 }, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="body2" color="text.disabled" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.7rem" }}>
              Trusted at
            </Typography>
            {["VIT Vellore", "BITS Pilani", "NIT Trichy", "SRM Chennai", "Amity University"].map((u) => (
              <Typography key={u} variant="body2" fontWeight={700} color="text.secondary">{u}</Typography>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── CORE FEATURES ───────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Chip label="Why SECUREID" color="primary" sx={{ mb: 2, px: 1 }} />
            <Typography variant="h3" fontWeight={800} color="text.primary">
              Everything you need, nothing you don't
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 500, mx: "auto", lineHeight: 1.7 }}>
              A purpose-built platform for student identity — secure, fast, and fully auditable.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {coreFeatures.map((f) => (
              <Grid size={{ xs: 12, md: 4 }} key={f.title}>
                <Card sx={{
                  height: "100%",
                  p: 0.5,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": { transform: "translateY(-8px)" },
                }}>
                  <CardContent sx={{ p: 3.5 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2.5 }}>
                      <Avatar sx={{
                        bgcolor: `${f.color}14`,
                        color: f.color,
                        width: 56, height: 56,
                        borderRadius: 3,
                      }}>
                        {f.icon}
                      </Avatar>
                      <Chip label={f.badge} size="small" color="primary" sx={{ mt: 0.5 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700} mb={1.5}>{f.title}</Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.75}>
                      {f.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <Box sx={{
        py: { xs: 8, md: 12 },
        background: "rgba(8,145,178,0.03)",
        borderTop: "1px solid rgba(8,145,178,0.08)",
        borderBottom: "1px solid rgba(8,145,178,0.08)",
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Chip label="How It Works" color="primary" sx={{ mb: 2, px: 1 }} />
            <Typography variant="h3" fontWeight={800}>
              Verified in 4 simple steps
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {steps.map((s, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={s.number}>
                <Box sx={{ textAlign: "center", px: { xs: 1, md: 2 }, position: "relative" }}>
                  {/* Connector arrow (desktop) */}
                  {i < steps.length - 1 && (
                    <Box sx={{
                      display: { xs: "none", md: "block" },
                      position: "absolute", top: 28, right: -8, zIndex: 1,
                      color: "primary.light", fontSize: "1.2rem",
                    }}>→</Box>
                  )}

                  <Box sx={{
                    width: 72, height: 72,
                    mx: "auto", mb: 2.5,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, rgba(8,145,178,0.1) 0%, rgba(34,211,238,0.15) 100%)",
                    border: "2px solid rgba(8,145,178,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "primary.main",
                    transition: "all 0.3s",
                    "&:hover": { background: "linear-gradient(135deg, #0891b2, #22d3ee)", color: "#fff", border: "2px solid transparent" },
                  }}>
                    {s.icon}
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      background: "linear-gradient(135deg, #0891b2, #22d3ee)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: 900,
                      fontSize: "0.9rem",
                      mb: 0.5,
                    }}
                  >
                    STEP {s.number}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} mb={1}>{s.title}</Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                    {s.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── USE CASES ───────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Chip label="Use Cases" color="primary" sx={{ mb: 2, px: 1 }} />
            <Typography variant="h3" fontWeight={800} color="text.primary">
              Built for every campus touchpoint
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 500, mx: "auto" }}>
              One identity platform, deployed across all student-facing processes.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {useCases.map((uc) => (
              <Grid size={{ xs: 12, sm: 6 }} key={uc.title}>
                <Card sx={{
                  height: "100%",
                  borderLeft: `4px solid ${uc.color}`,
                  transition: "transform 0.25s, box-shadow 0.25s",
                  "&:hover": { transform: "translateY(-5px)" },
                }}>
                  <CardContent sx={{ p: 3, display: "flex", gap: 2.5, alignItems: "flex-start" }}>
                    <Avatar sx={{ bgcolor: `${uc.color}14`, color: uc.color, width: 52, height: 52, borderRadius: 2.5, flexShrink: 0 }}>
                      {uc.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={700} mb={0.75}>{uc.title}</Typography>
                      <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                        {uc.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <Box sx={{
        py: { xs: 8, md: 11 },
        background: "linear-gradient(135deg, #0891b2 0%, #0e7490 40%, #164e63 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative blobs */}
        <Box sx={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.65)", letterSpacing: "0.14em", mb: 2, display: "block" }}>
            Join thousands of students
          </Typography>
          <Typography variant="h2" fontWeight={900} sx={{ color: "#fff", mb: 2, fontSize: { xs: "2rem", md: "3rem" } }}>
            Your campus identity,<br />verified in seconds.
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 400, mb: 5, maxWidth: 480, mx: "auto", lineHeight: 1.7 }}>
            Stop manual ID checks. Start secure, instant, AI-powered student verification today — completely free.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              component={RouterLink}
              to={isLoggedIn ? "/dashboard" : "/register"}
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "#fff",
                color: "#0891b2",
                fontWeight: 800,
                px: 5,
                py: 1.8,
                fontSize: "1rem",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.93)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 14px 40px rgba(0,0,0,0.25)",
                },
              }}
            >
              {isLoggedIn ? "Go to Dashboard" : "Create Free Account"}
            </Button>
            {!isLoggedIn && (
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "rgba(255,255,255,0.5)",
                  color: "#fff",
                  px: 4,
                  py: 1.8,
                  fontSize: "1rem",
                  borderRadius: "12px",
                  "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: "#0c1a27", color: "#fff", pt: { xs: 6, md: 8 }, pb: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 5 }}>
            {/* Brand */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: "10px",
                  background: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <ShieldIcon sx={{ fontSize: 20, color: "#fff" }} />
                </Box>
                <Typography variant="h6" fontWeight={800}>SECUREID</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.85, maxWidth: 280 }}>
                AI-powered student identity with facial recognition, KYC validation, and blockchain audit trail.
              </Typography>
            </Grid>

            {/* Platform */}
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.68rem" }}>
                Platform
              </Typography>
              {[
                { label: "Home", to: "/" },
                { label: "Sign In", to: "/login" },
                { label: "Register", to: "/register" },
                { label: "Dashboard", to: "/dashboard" },
              ].map(({ label, to }) => (
                <Typography key={label} component={RouterLink} to={to} variant="body2"
                  sx={{ display: "block", mb: 1, color: "rgba(255,255,255,0.6)", textDecoration: "none", "&:hover": { color: "#fff" }, transition: "color 0.2s" }}>
                  {label}
                </Typography>
              ))}
            </Grid>

            {/* Features */}
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.68rem" }}>
                Features
              </Typography>
              {["KYC Verification", "Face Authentication", "Digital Student ID", "Blockchain Audit", "Admin Dashboard"].map((f) => (
                <Typography key={f} variant="body2" sx={{ display: "block", mb: 1, color: "rgba(255,255,255,0.5)" }}>{f}</Typography>
              ))}
            </Grid>

            {/* Use Cases */}
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.68rem" }}>
                Use Cases
              </Typography>
              {["Exam Hall Entry", "Library Access", "Hostel Check-in", "Fee Payment Auth"].map((u) => (
                <Typography key={u} variant="body2" sx={{ display: "block", mb: 1, color: "rgba(255,255,255,0.5)" }}>{u}</Typography>
              ))}
            </Grid>

            {/* Tech */}
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "0.68rem" }}>
                Built With
              </Typography>
              {["FastAPI", "React + MUI", "DeepFace AI", "Hardhat + Solidity", "SQLAlchemy"].map((t) => (
                <Typography key={t} variant="body2" sx={{ display: "block", mb: 1, color: "rgba(255,255,255,0.5)" }}>{t}</Typography>
              ))}
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 3 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)" }}>
              © 2026 SECUREID. Built for hackathon.
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              {["Privacy", "Terms", "Contact"].map((link) => (
                <Typography key={link} variant="caption" sx={{ color: "rgba(255,255,255,0.35)", cursor: "pointer", "&:hover": { color: "rgba(255,255,255,0.7)" }, transition: "color 0.2s" }}>
                  {link}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
