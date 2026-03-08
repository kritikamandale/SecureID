import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedIcon from "@mui/icons-material/Verified";
import FaceIcon from "@mui/icons-material/Face";
import SecurityIcon from "@mui/icons-material/Security";
import { adminApi } from "../../services/api";
import SystemStatus from "../../components/SystemStatus";

function StatCard({ label, value, icon, color }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderTop: `4px solid ${color}`,
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-3px)" },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={700}
              sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
            >
              {label}
            </Typography>
            <Typography
              variant="h3"
              fontWeight={900}
              color="text.primary"
              sx={{ mt: 0.5 }}
            >
              {value ?? "—"}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              bgcolor: `${color}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .stats()
      .then((r) => setStats(r.data))
      .catch((e) =>
        setError(e.response?.data?.detail || "Failed to load stats"),
      );
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          Admin Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time overview of the SECUREID platform
        </Typography>
      </Box>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      {/* Stats */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Total Students"
            value={stats?.total_students}
            icon={<PeopleIcon />}
            color="#5C6BC0"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="KYC Verified"
            value={stats?.kyc_verified}
            icon={<VerifiedIcon />}
            color="#00C853"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Face Enrolled"
            value={stats?.face_enrolled}
            icon={<FaceIcon />}
            color="#7C4DFF"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            label="Auth Attempts"
            value={stats?.auth_attempts}
            icon={<SecurityIcon />}
            color="#FF7043"
          />
        </Grid>
      </Grid>

      {/* System Status */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>
            System Status
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <SystemStatus />
        </CardContent>
      </Card>
    </Box>
  );
}
