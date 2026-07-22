import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
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
        background: "linear-gradient(135deg, #121C2E 0%, #0B1220 100%)",
        color: "#EDF2F7",
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
        border: "1px solid rgba(0, 217, 192, 0.35)",
        boxShadow: "0 8px 32px rgba(0, 217, 192, 0.15)",
      }}
    >
      {/* Decorative ambient glow circles */}
      <Box
        sx={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          bgcolor: "rgba(0, 217, 192, 0.08)",
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
          bgcolor: "rgba(0, 217, 192, 0.05)",
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
              className="sid-mono"
              variant="overline"
              sx={{
                color: "#00D9C0",
                letterSpacing: 2,
                fontSize: "0.65rem",
                fontWeight: 700,
              }}
            >
              SECUREID — STUDENT DIGITAL ID
            </Typography>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ mt: 0.5, lineHeight: 1.2, color: "#EDF2F7" }}
            >
              {name || "—"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#8B98AC", mt: 0.5 }}
            >
              {email || "—"}
            </Typography>
            <Typography
              className="sid-mono"
              variant="caption"
              sx={{ color: "#00D9C0", display: "block", mt: 0.5, opacity: 0.9 }}
            >
              ID: #{studentId || "—"}
            </Typography>
          </Box>

          {/* QR Code */}
          <Box
            sx={{
              bgcolor: "#0B1220",
              p: 1,
              borderRadius: 2,
              border: "1px solid rgba(0, 217, 192, 0.3)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <QRCodeSVG value={qrValue} size={80} fgColor="#00D9C0" bgColor="#0B1220" />
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: "rgba(237, 242, 247, 0.08)" }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            icon={
              <VerifiedIcon
                sx={{
                  fontSize: "16px !important",
                  color: isVerified
                    ? "#34d399 !important"
                    : "#8B98AC !important",
                }}
              />
            }
            label={isVerified ? "KYC Verified" : "KYC Pending"}
            size="small"
            sx={{
              bgcolor: isVerified
                ? "rgba(16, 185, 129, 0.12)"
                : "rgba(237, 242, 247, 0.08)",
              color: isVerified ? "#34d399" : "#8B98AC",
              fontWeight: 700,
              border: `1px solid ${isVerified ? "rgba(16, 185, 129, 0.3)" : "rgba(237, 242, 247, 0.12)"}`,
            }}
          />
          <Typography
            className="sid-mono"
            variant="caption"
            sx={{ color: "#8B98AC", ml: "auto" }}
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
