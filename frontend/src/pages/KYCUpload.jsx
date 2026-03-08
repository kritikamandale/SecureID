import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { kycApi } from "../services/api";

const statusConfig = {
  verified: { color: "success", label: "KYC Approved ✅" },
  rejected: { color: "error", label: "KYC Rejected ❌" },
  pending: { color: "warning", label: "KYC Pending ⏳" },
};

export default function KYCUpload({ onComplete }) {
  const [aadhaar, setAadhaar] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileToBase64 = (f) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");
    const studentId = Number(localStorage.getItem("secureid_student_id"));
    if (!studentId) {
      setError("Student ID missing. Please register again.");
      return;
    }
    if (!file) {
      setError("Please upload your student ID card image.");
      return;
    }
    setLoading(true);
    try {
      const idImageB64 = await fileToBase64(file);
      const res = await kycApi.verify({
        student_id: studentId,
        aadhaar_number: aadhaar,
        id_card_image: idImageB64,
      });
      setStatus(res.data.status);
      if (res.data.status === "verified" && onComplete) onComplete();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        Array.isArray(detail)
          ? detail.map((e) => e.msg || JSON.stringify(e)).join("; ")
          : detail || "KYC verification failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const cfg = statusConfig[status] || {};

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #00BCD4 0%, #5C6BC0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BadgeIcon sx={{ fontSize: 18, color: "#fff" }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              KYC Verification
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Submit Aadhaar and student ID for verification
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 2.5 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {status && (
          <Alert
            severity={cfg.color}
            sx={{ mb: 2, borderRadius: 2, fontWeight: 700 }}
          >
            {cfg.label}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Aadhaar Number"
            type="text"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            inputProps={{ maxLength: 12 }}
            helperText="Use a 12-digit mock Aadhaar for verified status"
            fullWidth
          />

          <Box>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.secondary"
              mb={1}
            >
              Student ID Card Image
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              fullWidth
              sx={{
                py: 1.5,
                borderStyle: "dashed",
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              {file ? file.name : "Choose Image"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </Button>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ py: 1.3 }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Submit KYC"
            )}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
