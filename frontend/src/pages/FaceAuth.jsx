import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  LinearProgress,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { faceApi } from "../services/api";

function ConfidenceRing({ score }) {
  const color = score >= 80 ? "#00C853" : score >= 60 ? "#FF9800" : "#f44336";
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress
        variant="determinate"
        value={100}
        size={120}
        thickness={4}
        sx={{ color: "rgba(0,0,0,0.06)", position: "absolute" }}
      />
      <CircularProgress
        variant="determinate"
        value={score}
        size={120}
        thickness={4}
        sx={{ color }}
      />
      <Box sx={{ position: "absolute", textAlign: "center" }}>
        <Typography variant="h5" fontWeight={800} sx={{ color, lineHeight: 1 }}>
          {score.toFixed(1)}%
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Confidence
        </Typography>
      </Box>
    </Box>
  );
}

export default function FaceAuth({ onComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      } catch {
        setError("Unable to access webcam. Please allow camera permissions.");
      }
    };
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const captureAndAuthenticate = async () => {
    setError("");
    setResult(null);
    const studentId = Number(localStorage.getItem("secureid_student_id"));
    if (!studentId) {
      setError("Student ID missing. Please register again.");
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/jpeg").split(",")[1];

    setLoading(true);
    try {
      const res = await faceApi.authenticate({
        student_id: studentId,
        live_image: base64,
      });
      setResult(res.data);
      if (res.data.verified && onComplete) onComplete();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        Array.isArray(detail)
          ? detail.map((e) => e.msg || JSON.stringify(e)).join("; ")
          : detail || "Face authentication failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const verified = result?.verified;
  const score = result?.confidence_score ?? 0;

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #5C6BC0 0%, #7C4DFF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CameraAltIcon sx={{ fontSize: 18, color: "#fff" }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Face Authentication
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Verify identity with a live capture
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Verified result card */}
        {result && (
          <Card
            variant="outlined"
            sx={{
              mb: 2.5,
              borderRadius: 3,
              borderColor: verified ? "success.main" : "error.main",
              bgcolor: verified
                ? "rgba(0,200,83,0.05)"
                : "rgba(244,67,54,0.05)",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  flexWrap: "wrap",
                }}
              >
                <ConfidenceRing score={score} />
                <Box sx={{ flex: 1, minWidth: 160 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    {verified ? (
                      <CheckCircleIcon
                        sx={{ color: "#00C853", fontSize: 24 }}
                      />
                    ) : (
                      <CancelIcon sx={{ color: "#f44336", fontSize: 24 }} />
                    )}
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color={verified ? "success.dark" : "error.dark"}
                    >
                      {verified
                        ? "Student Verified ✅"
                        : "Verification Failed ❌"}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Face Match Confidence
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={score}
                      sx={{
                        mt: 0.5,
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "rgba(0,0,0,0.06)",
                        "& .MuiLinearProgress-bar": {
                          bgcolor:
                            score >= 80
                              ? "#00C853"
                              : score >= 60
                                ? "#FF9800"
                                : "#f44336",
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  <Chip
                    label={`Status: ${verified ? "VERIFIED" : "REJECTED"}`}
                    size="small"
                    sx={{
                      bgcolor: verified
                        ? "rgba(0,200,83,0.15)"
                        : "rgba(244,67,54,0.15)",
                      color: verified ? "success.dark" : "error.dark",
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  />
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Timestamp:{" "}
                    {new Date().toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Camera + button */}
        <Box
          sx={{
            display: "flex",
            gap: 2.5,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              flex: "0 0 auto",
              width: 220,
              aspectRatio: "4/3",
              bgcolor: "#1A1F36",
              borderRadius: 3,
              overflow: "hidden",
              border: "2px solid rgba(92,107,192,0.3)",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              flex: 1,
              minWidth: 160,
            }}
          >
            <Button
              variant="contained"
              disabled={!streaming || loading}
              onClick={captureAndAuthenticate}
              startIcon={
                loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <CameraAltIcon />
                )
              }
              sx={{ py: 1.2 }}
            >
              {loading ? "Authenticating…" : "Capture & Authenticate"}
            </Button>
            <Typography
              variant="caption"
              color="text.secondary"
              lineHeight={1.6}
            >
              Compares your live capture with your enrolled face embedding.
              Results include a confidence score.
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
