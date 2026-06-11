import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Container,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { studentApi } from "../services/api";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import MemoryIcon from "@mui/icons-material/Memory";
import GppGoodIcon from "@mui/icons-material/GppGood";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import LinkIcon from "@mui/icons-material/Link";

export default function StudentDashboard() {
  const { userName, userEmail, studentId } = useAuth();
  const [timeline, setTimeline] = useState([]);
  const [blockchainHistory, setBlockchainHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const kycStatus = timeline.find((t) => t.type === "kyc") ? "Verified" : "Pending";
  const faceEnrolled = timeline.find((t) => t.type === "face_enrollment");
  const authLogs = timeline.filter((t) => t.type === "authentication");
  const latestAuth = authLogs.length > 0 ? authLogs[0] : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timelineRes = await studentApi.getTimeline();
        setTimeline(timelineRes.data);

        if (studentId) {
          try {
            const historyRes = await studentApi.getVerificationHistory(studentId);
            setBlockchainHistory(historyRes.data.history || []);
          } catch {
            setBlockchainHistory([]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      <Container maxWidth="lg" sx={{ pt: 5 }}>
        <Box sx={{ mb: 4 }}>
          <Chip
            label="Student Portal"
            size="small"
            sx={{
              mb: 1.5,
              bgcolor: "rgba(92,107,192,0.1)",
              color: "primary.dark",
              fontWeight: 700,
            }}
          />
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Student Verification Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            View your secure credentials and verifiable on-chain history.
          </Typography>
        </Box>

        {/* Top Cards: Identity, KYC, Face Auth */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "#e3f2fd",
                      color: "#1565c0",
                    }}
                  >
                    <FingerprintIcon />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    Identity
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" fontWeight={600} mb={1}>
                  {userName || "Unknown"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Student ID
                </Typography>
                <Typography variant="body1" fontWeight={600} mb={1}>
                  {studentId || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {userEmail}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "#e8f5e9",
                      color: "#2e7d32",
                    }}
                  >
                    <CheckCircleIcon />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    KYC Status
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  {kycStatus === "Verified" ? (
                    <GppGoodIcon color="success" />
                  ) : (
                    <ErrorIcon color="warning" />
                  )}
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    color={
                      kycStatus === "Verified" ? "success.main" : "warning.main"
                    }
                  >
                    {kycStatus}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: "#fce4ec",
                      color: "#c2185b",
                    }}
                  >
                    <MemoryIcon />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    Face Auth
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    color={
                      latestAuth?.title.includes("Success")
                        ? "success.main"
                        : faceEnrolled
                          ? "primary.main"
                          : "text.secondary"
                    }
                  >
                    {latestAuth
                      ? latestAuth.title.includes("Success")
                        ? "Passed"
                        : "Failed"
                      : faceEnrolled
                        ? "Enrolled"
                        : "Not Enrolled"}
                  </Typography>
                </Box>
                {latestAuth && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {latestAuth.detail}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Blockchain Record Section */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Blockchain Verification Records
            </Typography>

            {blockchainHistory.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 4,
                  gap: 1,
                }}
              >
                <LinkIcon sx={{ fontSize: 40, color: "text.disabled" }} />
                <Typography variant="body2" color="text.secondary">
                  No on-chain records yet. Complete face authentication to create your first blockchain entry.
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  overflowX: "auto",
                  pb: 2,
                }}
              >
                {blockchainHistory.map((record, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        p: 2,
                        minWidth: 220,
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        bgcolor: "#1e1e2d",
                        color: "#fff",
                        position: "relative",
                      }}
                    >
                      {i === 0 && (
                        <Chip
                          size="small"
                          label="Latest"
                          sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            bgcolor: "#7c4dff",
                            color: "#fff",
                            fontSize: "0.65rem",
                          }}
                        />
                      )}
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{ color: "#90caf9" }}
                      >
                        {record.verified ? "✓ Verified" : "✗ Failed"}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 1, fontFamily: "monospace", opacity: 0.8, wordBreak: "break-all" }}
                      >
                        Hash: {record.documentHash?.slice(0, 18)}…
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ fontFamily: "monospace", opacity: 0.7 }}
                      >
                        Score: {record.faceScore}%
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ opacity: 0.6, mt: 0.5 }}
                      >
                        {new Date(record.timestamp * 1000).toLocaleDateString("en-IN")}
                      </Typography>
                    </Box>
                    {i < blockchainHistory.length - 1 && (
                      <Box sx={{ mx: 2, color: "text.secondary", fontWeight: "bold" }}>
                        →
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                component={RouterLink}
                to="/verification-history"
                variant="outlined"
                color="primary"
                size="small"
              >
                View Full Immutable Ledger
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Authentication History */}
        <Card
          sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Authentication History
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Date & Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Action</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Result</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {authLogs.map((log, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>Face Recognition Scan</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          log.title.includes("Success") ? "Passed" : "Failed"
                        }
                        color={
                          log.title.includes("Success") ? "success" : "error"
                        }
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {authLogs.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{ py: 3, color: "text.secondary" }}
                    >
                      No authentication history available.
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
