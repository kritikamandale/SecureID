import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { studentApi } from "../services/api";

export default function Timeline({ timelineData }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (timelineData) {
      setEvents(timelineData);
      setLoading(false);
      return;
    }
    studentApi
      .getTimeline()
      .then((res) => setEvents(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [timelineData]);

  if (loading)
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <CircularProgress size={24} color="primary" />
      </Box>
    );

  if (!events.length) return null;

  return (
    <Card sx={{ background: "#121C2E", border: "1px solid rgba(237, 242, 247, 0.08)" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2.5} color="text.primary">
          Recent Activity
        </Typography>
        <Box sx={{ position: "relative", pl: 2.5 }}>
          {/* Vertical line */}
          <Box
            sx={{
              position: "absolute",
              left: 7,
              top: 8,
              bottom: 8,
              width: 2,
              background: "linear-gradient(180deg, #00D9C0, rgba(0,217,192,0.1))",
              borderRadius: 1,
            }}
          />
          {events.map((ev, i) => (
            <Box key={i} sx={{ position: "relative", mb: i < events.length - 1 ? 3 : 0 }}>
              {/* Dot */}
              <Box
                sx={{
                  position: "absolute",
                  left: -9,
                  top: 5,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #00D9C0, #00a592)",
                  boxShadow: "0 0 0 3px rgba(0,217,192,0.2)",
                }}
              />
              <Typography variant="body2" fontWeight={700} color="text.primary" lineHeight={1.3}>
                {ev.title}
              </Typography>
              <Typography className="sid-mono" variant="caption" color="text.disabled" display="block" mb={0.5}>
                {new Date(ev.timestamp).toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary" lineHeight={1.6}>
                {ev.detail}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
