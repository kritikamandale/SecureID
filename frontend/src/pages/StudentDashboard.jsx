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
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { studentApi } from "../services/api";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import MemoryIcon from "@mui/icons-material/Memory";
import GppGoodIcon from "@mui/icons-material/GppGood";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function StudentDashboard() {
  const { userName, userEmail, studentId } = useAuth();
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Derived state for the cards based on timeline log
  const kycStatus = timeline.find((t) => t.type === "kyc")
    ? "Verified"
    : "Pending";
  const faceEnrolled = timeline.find((t) => t.type === "face_enrollment");
  const authLogs = timeline.filter((t) => t.type === "authentication");
  const latestAuth = authLogs.length > 0 ? authLogs[0] : null;

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await studentApi.getTimeline();
        setTimeline(res.data);
      } catch (err) {
        console.error("Failed to fetch timeline:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  // Blockchain Mock Data
  const blocks = [
    {
      blockNum: 19849855,
      txId: "0x8fa...d21",
      hash: "b2c7...8e1a",
      genesis: true,
    },
    {
      blockNum: 19849856,
      txId: "0x91c...f8b",
      hash: "1a9f...c28d",
      genesis: false,
    },
    {
      blockNum: "Pending",
      txId: "Processing...",
      hash: "Computing...",
      genesis: false,
    },
  ];

  if (isLoading)
    return (
      <Box p={4}>
        <Typography>Loading Dashboard...</Typography>
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
                {kycStatus === "Verified" && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Score: 0.92
                  </Typography>
                )}
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
              Blockchain Record Section
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                overflowX: "auto",
                pb: 2,
              }}
            >
              {blocks.map((b, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      p: 2,
                      minWidth: 200,
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      bgcolor: b.blockNum === "Pending" ? "#f5f5f5" : "#1e1e2d",
                      color: b.blockNum === "Pending" ? "#333" : "#fff",
                      position: "relative",
                    }}
                  >
                    {b.genesis && (
                      <Chip
                        size="small"
                        label="Genesis"
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
                      sx={{
                        color:
                          b.blockNum === "Pending"
                            ? "text.secondary"
                            : "#90caf9",
                      }}
                    >
                      Block #{b.blockNum}
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1, fontFamily: "monospace" }}
                    >
                      Tx: {b.txId}
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ fontFamily: "monospace" }}
                    >
                      Hash: {b.hash}
                    </Typography>
                  </Box>
                  {i < blocks.length - 1 && (
                    <Box
                      sx={{
                        mx: 2,
                        color: "text.secondary",
                        fontWeight: "bold",
                      }}
                    >
                      →
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
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
