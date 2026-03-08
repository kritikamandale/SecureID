import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import { QRCodeSVG } from "qrcode.react";

export default function StudentIDCard({ name, email, studentId, kycStatus }) {
  const isVerified = kycStatus === "verified";
  const qrValue = `SECUREID:${studentId}:${email || ""}`;

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #5C6BC0 0%, #7C4DFF 100%)",
        color: "#fff",
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
        border: "none",
        boxShadow: "0 8px 32px rgba(92,107,192,0.4)",
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.08)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          left: -20,
          width: 100,
          height: 100,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.06)",
        }}
      />

      <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: "rgba(255,255,255,0.7)",
                letterSpacing: 2,
                fontSize: "0.65rem",
              }}
            >
              SECUREID — STUDENT DIGITAL ID
            </Typography>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ mt: 0.5, lineHeight: 1.2 }}
            >
              {name || "—"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}
            >
              {email || "—"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.6)", display: "block", mt: 0.5 }}
            >
              ID: #{studentId || "—"}
            </Typography>
          </Box>

          {/* QR Code */}
          <Box
            sx={{
              bgcolor: "#fff",
              p: 1,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <QRCodeSVG value={qrValue} size={80} fgColor="#1A1F36" />
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            icon={
              <VerifiedIcon
                sx={{
                  fontSize: "16px !important",
                  color: isVerified
                    ? "#00C853 !important"
                    : "rgba(255,255,255,0.5) !important",
                }}
              />
            }
            label={isVerified ? "KYC Verified" : "KYC Pending"}
            size="small"
            sx={{
              bgcolor: isVerified
                ? "rgba(0,200,83,0.2)"
                : "rgba(255,255,255,0.15)",
              color: isVerified ? "#69F0AE" : "rgba(255,255,255,0.7)",
              fontWeight: 700,
              border: `1px solid ${isVerified ? "rgba(0,200,83,0.5)" : "rgba(255,255,255,0.3)"}`,
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.6)", ml: "auto" }}
          >
            Issued:{" "}
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
