import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { faceApi } from "../services/api";

export default function FaceEnroll({ onComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [result, setResult] = useState("");
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
      if (videoRef.current?.srcObject)
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const captureAndEnroll = async () => {
    setError("");
    setResult("");
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
      const res = await faceApi.enroll({
        student_id: studentId,
        selfie_image: base64,
      });
      setResult(
        `Enrollment successful — confidence ${res.data.confidence_score?.toFixed(1) ?? "N/A"}%`,
      );
      if (onComplete) onComplete();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        Array.isArray(detail)
          ? detail.map((e) => e.msg || JSON.stringify(e)).join("; ")
          : detail || "Face enrollment failed",
      );
    } finally {
      setLoading(false);
    }
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
              background: "linear-gradient(135deg, #7C4DFF 0%, #EC407A 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PhotoCameraIcon sx={{ fontSize: 18, color: "#fff" }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Face Enrollment
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Capture a selfie to enroll your biometric identity
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 2.5 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        {result && (
          <Alert
            severity="success"
            icon={<CheckCircleIcon />}
            sx={{ mb: 2, borderRadius: 2 }}
          >
            {result}
          </Alert>
        )}

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
              border: "2px solid rgba(124,77,255,0.3)",
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
              onClick={captureAndEnroll}
              startIcon={
                loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <PhotoCameraIcon />
                )
              }
              sx={{
                py: 1.2,
                background: "linear-gradient(135deg, #7C4DFF 0%, #EC407A 100%)",
              }}
            >
              {loading ? "Enrolling…" : "Capture & Enroll"}
            </Button>
            <Typography
              variant="caption"
              color="text.secondary"
              lineHeight={1.6}
            >
              Ensure your face is clearly visible and centered before capturing.
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
