import { useEffect, useState } from "react";
import { Box, Chip, Typography, CircularProgress } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const FACE_URL = "http://localhost:8001";

async function checkHealth(url) {
  try {
    const res = await fetch(`${url}/health`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === "ok";
  } catch {
    return false;
  }
}

const services = [
  { label: "Backend API", url: BACKEND_URL },
  { label: "Face Service", url: FACE_URL },
];

export default function SystemStatus({ compact = false }) {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const poll = async () => {
    const results = await Promise.all(
      services.map(async (s) => ({
        label: s.label,
        online: await checkHealth(s.url),
      })),
    );
    setStatuses(results);
    setLoading(false);
  };

  useEffect(() => {
    poll();
    const id = setInterval(poll, 30000);
    return () => clearInterval(id);
  }, []);

  if (compact) {
    return (
      <Box
        sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}
      >
        {loading ? (
          <CircularProgress size={16} />
        ) : (
          statuses.map((s) => (
            <Chip
              key={s.label}
              icon={
                <FiberManualRecordIcon
                  sx={{
                    fontSize: "10px !important",
                    color: s.online
                      ? "#00C853 !important"
                      : "#f44336 !important",
                  }}
                />
              }
              label={`${s.label}: ${s.online ? "Online" : "Offline"}`}
              size="small"
              sx={{
                bgcolor: s.online
                  ? "rgba(0,200,83,0.1)"
                  : "rgba(244,67,54,0.1)",
                color: s.online ? "#007B33" : "#C62828",
                border: `1px solid ${s.online ? "rgba(0,200,83,0.3)" : "rgba(244,67,54,0.3)"}`,
              }}
            />
          ))
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(92,107,192,0.15)",
        borderRadius: 3,
        p: 3,
        maxWidth: 480,
        mx: "auto",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={700}
        mb={1.5}
        color="text.primary"
      >
        System Status
      </Typography>
      {loading ? (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            Checking services…
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {statuses.map((s) => (
            <Box
              key={s.label}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
              >
                {s.label}
              </Typography>
              <Chip
                icon={
                  <FiberManualRecordIcon
                    sx={{
                      fontSize: "10px !important",
                      color: s.online
                        ? "#00C853 !important"
                        : "#f44336 !important",
                    }}
                  />
                }
                label={s.online ? "Online" : "Offline"}
                size="small"
                sx={{
                  bgcolor: s.online
                    ? "rgba(0,200,83,0.12)"
                    : "rgba(244,67,54,0.12)",
                  color: s.online ? "#007B33" : "#C62828",
                  fontWeight: 700,
                  border: `1px solid ${s.online ? "rgba(0,200,83,0.35)" : "rgba(244,67,54,0.35)"}`,
                }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
