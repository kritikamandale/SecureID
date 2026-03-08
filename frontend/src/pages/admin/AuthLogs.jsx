import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { adminApi, API_BASE_URL } from "../../services/api";

export default function AuthLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = async () => {
    try {
      const res = await adminApi.authLogs();
      setLogs(res.data);
      setLastRefresh(new Date());
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        Array.isArray(detail)
          ? detail.map((e) => e.msg || JSON.stringify(e)).join("; ")
          : detail || "Failed to load logs",
      );
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const getActionLabel = (log) => {
    if (log.confidence_score !== undefined) return "Face Auth";
    return "KYC";
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #00BCD4 0%, #00838F 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AssignmentIcon sx={{ fontSize: 18, color: "#fff" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              Live Verification Log
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Auto-refreshes every 30s · Last:{" "}
              {lastRefresh.toLocaleTimeString("en-IN")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Tooltip title="Refresh now">
              <IconButton size="small" onClick={load}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export CSV">
              <IconButton
                size="small"
                onClick={() =>
                  window.open(
                    `${API_BASE_URL}/admin/export/auth-logs`,
                    "_blank",
                  )
                }
              >
                <DownloadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Result</TableCell>
                <TableCell>Confidence</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 4, color: "text.secondary" }}
                  >
                    No authentication attempts recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow
                    key={log.id}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                      #{log.student_id}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getActionLabel(log)}
                        size="small"
                        sx={{
                          bgcolor: "rgba(92,107,192,0.1)",
                          color: "primary.dark",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.success ? "Verified ✓" : "Failed ✗"}
                        size="small"
                        sx={{
                          bgcolor: log.success
                            ? "rgba(0,200,83,0.12)"
                            : "rgba(244,67,54,0.12)",
                          color: log.success ? "success.dark" : "error.dark",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          border: `1px solid ${log.success ? "rgba(0,200,83,0.3)" : "rgba(244,67,54,0.3)"}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          color:
                            log.confidence_score >= 80
                              ? "success.dark"
                              : log.confidence_score >= 60
                                ? "warning.dark"
                                : "error.dark",
                        }}
                      >
                        {log.confidence_score?.toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                    >
                      {new Date(log.timestamp).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
}
