import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { studentApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function StudentVerificationHistory() {
  const { studentId, userName, isLoggedIn } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }
      try {
        const res = await studentApi.getVerificationHistory(studentId);
        setHistory(res.data.history || []);
      } catch (err) {
        console.error("Failed to fetch blockchain history:", err);
        setError("Failed to load secure ledger records.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [studentId]);

  const formatDate = (timestamp) => {
    // Timestamp is usually in seconds
    const d = new Date(timestamp * 1000);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundImage: "url('/blockchain-bg.svg')",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 800,
          mx: "auto",
          borderRadius: 3,
          boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          color="primary"
          sx={{ mb: 1 }}
        >
          Student Verification History
        </Typography>

        {isLoggedIn && (
          <Box
            sx={{
              mb: 4,
              display: "flex",
              gap: 4,
              borderBottom: "1px solid #eee",
              pb: 2,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Student Name
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {userName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Student ID
              </Typography>
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{ fontFamily: "monospace" }}
              >
                {studentId}
              </Typography>
            </Box>
          </Box>
        )}

        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          Verification Ledger
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : history.length === 0 ? (
          <Typography color="text.secondary">
            No verification records found on the blockchain.
          </Typography>
        ) : (
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <List disablePadding>
              {history.map((record, index) => (
                <Box key={index}>
                  <ListItem sx={{ py: 2, px: 3 }}>
                    <ListItemIcon>
                      {record.verified ? (
                        <CheckCircleIcon
                          color="success"
                          sx={{ fontSize: 28 }}
                        />
                      ) : (
                        <CancelIcon color="error" sx={{ fontSize: 28 }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={600}>
                          {formatDate(record.timestamp)} –{" "}
                          {record.verified
                            ? index === history.length - 1 && history.length > 1
                              ? "Re-Verified"
                              : "Verified"
                            : "Failed Verification"}{" "}
                          – Face Score: {record.faceScore}%
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            mt: 0.5,
                            wordBreak: "break-all",
                          }}
                        >
                          Tx Hash: {record.documentHash}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < history.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Card>
        )}
      </Paper>
    </Box>
  );
}
