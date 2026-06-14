import { useEffect, useState } from "react";
import { adminApi, API_BASE_URL } from "../../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await adminApi.students();
      setStudents(res.data);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        Array.isArray(detail)
          ? detail.map((e) => e.msg || JSON.stringify(e)).join("; ")
          : detail || "Failed to load students",
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRevoke = async (studentId) => {
    if (
      !window.confirm(
        "Are you sure you want to revoke verification for this student?",
      )
    )
      return;
    try {
      await adminApi.revoke(studentId);
      load();
    } catch (err) {
      alert("Failed to revoke verification");
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Registered Students
        </Typography>
        <Button
          onClick={() =>
            window.open(`${API_BASE_URL}/admin/export/students`, "_blank")
          }
          variant="outlined"
          size="small"
        >
          Export CSV
        </Button>
      </Box>
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "rgba(0,0,0,0.02)" }}>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>University</strong>
              </TableCell>
              <TableCell>
                <strong>KYC Status</strong>
              </TableCell>
              <TableCell>
                <strong>Face Status</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.university || "N/A"}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={row.kyc_status}
                    color={
                      row.kyc_status === "verified" ? "success" : "warning"
                    }
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={row.face_registered ? "Enrolled" : "Pending"}
                    color={row.face_registered ? "primary" : "default"}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleRevoke(row.id)}
                    startIcon={<DeleteOutlineIcon />}
                  >
                    Revoke
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {students.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No students enrolled yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
