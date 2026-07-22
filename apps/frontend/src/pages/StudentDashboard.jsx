import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { studentApi } from "../services/api";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import GppGoodIcon from "@mui/icons-material/GppGood";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import LinkIcon from "@mui/icons-material/Link";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import HistoryIcon from "@mui/icons-material/History";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

// ── 7-day bar chart (pure MUI, no extra deps) ─────────────────
function AuthChart({ days }) {
  const maxAttempts = Math.max(...days.map((d) => d.attempts), 1);
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 80 }}>
        {days.map((d) => (
          <Tooltip
            key={d.date}
            title={`${d.date.slice(5)}: ${d.successes}/${d.attempts} passed`}
            placement="top"
          >
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, cursor: "default" }}
            >
              <Box sx={{ width: "100%", height: 64, position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: d.attempts === 0 ? 4 : `${(d.attempts / maxAttempts) * 100}%`,
                    bgcolor: d.attempts === 0 ? "rgba(237, 242, 247, 0.08)" : "rgba(239, 68, 68, 0.4)",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.4s ease",
                  }}
                />
                {d.successes > 0 && (
                  <Box
                    sx={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      height: `${(d.successes / maxAttempts) * 100}%`,
                      bgcolor: "primary.main",
                      borderRadius: "4px 4px 0 0",
                      opacity: 0.85,
                      transition: "height 0.4s ease",
                    }}
                  />
                )}
              </Box>
              <Typography className="sid-mono" variant="caption" color="text.secondary" fontSize="0.6rem" noWrap>
                {d.date.slice(5)}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 2, mt: 1.5 }}>
        {[{ color: "primary.main", label: "Passed" }, { color: "rgba(239, 68, 68, 0.5)", label: "Failed" }].map(({ color, label }) => (
          <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, bgcolor: color, borderRadius: 0.5 }} />
            <Typography variant="caption" color="text.secondary">{label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function StatCard({ icon, iconBg, iconColor, title, value, subtitle, accent }) {
  return (
    <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", borderLeft: `3px solid ${accent}` }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: iconBg, color: iconColor, display: "flex" }}>
            {icon}
          </Box>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>{title}</Typography>
        </Box>
        <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.1 }}>{value}</Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function StudentDashboard() {
  const { userName, userEmail, studentId } = useAuth();
  const [timeline, setTimeline] = useState([]);
  const [stats, setStats] = useState(null);
  const [blockchainHistory, setBlockchainHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const kycVerified = timeline.some((t) => t.type === "kyc");
  const faceEnrolled = timeline.some((t) => t.type === "face_enrollment");
  const authLogs = timeline.filter((t) => t.type === "authentication");
  const recentFailures = authLogs.filter(
    (l) =>
      !l.title.includes("Success") &&
      new Date(l.timestamp) > new Date(Date.now() - 7 * 86400 * 1000)
  );

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [timelineRes, statsRes] = await Promise.all([
          studentApi.getTimeline(),
          studentApi.getStats(),
        ]);
        setTimeline(timelineRes.data);
        setStats(statsRes.data);

        if (studentId) {
          try {
            const histRes = await studentApi.getVerificationHistory(studentId);
            setBlockchainHistory(histRes.data.history || []);
          } catch {
            setBlockchainHistory([]);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [studentId]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", pb: 8 }}>
      <Container maxWidth="lg" sx={{ pt: 5 }}>

        {/* Header */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Chip
              label="Student Portal"
              size="small"
              sx={{ mb: 1.5, bgcolor: "rgba(34,211,238,0.1)", color: "primary.main", fontWeight: 700 }}
            />
            <Typography variant="h4" fontWeight={800} color="text.primary">
              Welcome back, {userName?.split(" ")[0] || "Student"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Your secure identity dashboard — everything in one place.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/profile"
            variant="outlined"
            startIcon={<AccountCircleIcon />}
            size="small"
            sx={{ borderRadius: 2, fontWeight: 600, alignSelf: "center" }}
          >
            Edit Profile
          </Button>
        </Box>

        {/* Security alert */}
        {recentFailures.length >= 3 && (
          <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 3, borderRadius: 2 }}>
            <strong>{recentFailures.length} failed</strong> authentication attempts in the last 7 days.
            If this wasn't you, review your account security.
          </Alert>
        )}

        {/* Stats row */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}>
            <StatCard
              icon={<TrendingUpIcon />}
              iconBg="#e3f2fd" iconColor="#1565c0" accent="#1565c0"
              title="Auth Attempts" value={stats?.total_attempts ?? "—"}
              subtitle="All time"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard
              icon={<VerifiedUserIcon />}
              iconBg="#e8f5e9" iconColor="#2e7d32" accent="#2e7d32"
              title="Success Rate" value={stats ? `${stats.success_rate}%` : "—"}
              subtitle={stats ? `${stats.success_count} passed` : ""}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard
              icon={<CheckCircleIcon />}
              iconBg={kycVerified ? "#e8f5e9" : "#fff8e1"}
              iconColor={kycVerified ? "#2e7d32" : "#f57f17"}
              accent={kycVerified ? "#2e7d32" : "#f57f17"}
              title="KYC Status" value={kycVerified ? "Verified" : "Pending"}
              subtitle={kycVerified ? "Identity confirmed" : "Complete KYC first"}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard
              icon={<FingerprintIcon />}
              iconBg={faceEnrolled ? "#fce4ec" : "#f3e5f5"}
              iconColor={faceEnrolled ? "#c2185b" : "#7b1fa2"}
              accent={faceEnrolled ? "#c2185b" : "#7b1fa2"}
              title="Biometrics" value={faceEnrolled ? "Enrolled" : "Not Enrolled"}
              subtitle={faceEnrolled ? "Face ID active" : "Enroll face to enable auth"}
            />
          </Grid>
        </Grid>

        {/* Chart + Quick Actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                  <Typography variant="h6" fontWeight={700}>Auth Activity — Last 7 Days</Typography>
                  {stats && (
                    <Chip
                      size="small"
                      label={`${stats.days.reduce((s, d) => s + d.attempts, 0)} attempts`}
                      sx={{ bgcolor: "rgba(34,211,238,0.1)", color: "primary.main", fontWeight: 600 }}
                    />
                  )}
                </Box>
                {stats ? (
                  <AuthChart days={stats.days} />
                ) : (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <Typography variant="body2" color="text.secondary">No data yet</Typography>
                  </Box>
                )}
                {stats && stats.total_attempts > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Overall success rate</Typography>
                      <Typography variant="caption" fontWeight={700}>{stats.success_rate}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stats.success_rate}
                      sx={{
                        borderRadius: 1, height: 6, bgcolor: "grey.200",
                        "& .MuiLinearProgress-bar": { bgcolor: "success.main" },
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2.5}>Quick Actions</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {[
                    { label: "Face Authenticate", icon: <FaceRetouchingNaturalIcon sx={{ fontSize: 18 }} />, to: "/verify", variant: "contained", disabled: !faceEnrolled },
                    { label: "Start Verification", icon: <PlayCircleIcon sx={{ fontSize: 18 }} />, to: "/verify", variant: "outlined", disabled: false },
                    { label: "Auth History", icon: <HistoryIcon sx={{ fontSize: 18 }} />, to: "/verification-history", variant: "outlined", disabled: false },
                    { label: "Edit Profile", icon: <AccountCircleIcon sx={{ fontSize: 18 }} />, to: "/profile", variant: "outlined", disabled: false },
                  ].map(({ label, icon, to, variant, disabled }) => (
                    <Button
                      key={label}
                      component={RouterLink}
                      to={to}
                      variant={variant}
                      startIcon={icon}
                      disabled={disabled}
                      fullWidth
                      sx={{ justifyContent: "flex-start", borderRadius: 2, fontWeight: 600 }}
                    >
                      {label}
                    </Button>
                  ))}
                </Box>
                <Box sx={{ mt: 3, p: 2, bgcolor: "rgba(34,211,238,0.05)", borderRadius: 2, border: "1px solid rgba(34,211,238,0.1)" }}>
                  <Typography variant="caption" color="text.secondary" display="block" fontWeight={600} mb={0.5}>
                    Signed in as
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>{userEmail}</Typography>
                  {stats && (
                    <Typography variant="caption" color="text.secondary">
                      {stats.success_count} successful auth{stats.success_count !== 1 ? "s" : ""}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Blockchain Records */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={3}>Blockchain Verification Records</Typography>
            {blockchainHistory.length === 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4, gap: 1 }}>
                <LinkIcon sx={{ fontSize: 40, color: "text.disabled" }} />
                <Typography variant="body2" color="text.secondary">
                  No on-chain records yet. Complete face authentication to create your first blockchain entry.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, overflowX: "auto", pb: 2 }}>
                {blockchainHistory.map((record, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ p: 2, minWidth: 220, border: "1px solid rgba(8,145,178,0.2)", borderRadius: 2, bgcolor: "#f0f9ff", color: "text.primary", position: "relative" }}>
                      {i === 0 && (
                        <Chip size="small" label="Latest" color="primary" sx={{ position: "absolute", top: -10, right: -10, fontSize: "0.65rem" }} />
                      )}
                      <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                        {record.verified ? "✓ Verified" : "✗ Failed"}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 1, fontFamily: "monospace", opacity: 0.8, wordBreak: "break-all" }}>
                        Hash: {record.documentHash?.slice(0, 18)}…
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ fontFamily: "monospace", opacity: 0.7 }}>
                        Score: {record.faceScore}%
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ opacity: 0.6, mt: 0.5 }}>
                        {new Date(record.timestamp * 1000).toLocaleDateString("en-IN")}
                      </Typography>
                    </Box>
                    {i < blockchainHistory.length - 1 && (
                      <Box sx={{ mx: 2, color: "text.secondary", fontWeight: "bold" }}>→</Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button component={RouterLink} to="/verification-history" variant="outlined" size="small">
                View Full Ledger
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Auth History Table */}
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>Authentication History</Typography>
              <Chip size="small" label={`${authLogs.length} record${authLogs.length !== 1 ? "s" : ""}`} sx={{ bgcolor: "grey.100", fontWeight: 600 }} />
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date & Time</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                  <TableCell><strong>Confidence</strong></TableCell>
                  <TableCell><strong>Result</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {authLogs.slice(0, 10).map((log, i) => {
                  const passed = log.title.includes("Success");
                  const score = parseFloat(log.detail?.match(/[\d.]+/)?.[0] || "0");
                  return (
                    <TableRow key={i} sx={{ "&:hover": { bgcolor: "grey.50" } }}>
                      <TableCell>{new Date(log.timestamp).toLocaleString("en-IN")}</TableCell>
                      <TableCell>Face Recognition Scan</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={score}
                            sx={{
                              flex: 1, height: 5, borderRadius: 1, bgcolor: "grey.200",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: score >= 70 ? "success.main" : score >= 50 ? "warning.main" : "error.main",
                              },
                            }}
                          />
                          <Typography variant="caption" fontWeight={600}>{score.toFixed(0)}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={passed ? "Passed" : "Failed"}
                          color={passed ? "success" : "error"}
                          icon={passed ? <GppGoodIcon style={{ fontSize: 14 }} /> : <ErrorIcon style={{ fontSize: 14 }} />}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {authLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                      No authentication history yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </Container>
    </Box>
  );
}
