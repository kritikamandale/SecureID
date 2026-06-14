import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  Chip,
  Avatar,
  CircularProgress,
  InputAdornment,
  IconButton,
  Tab,
  Tabs,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { studentApi, authApi } from "../services/api";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SecurityIcon from "@mui/icons-material/Security";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

export default function ProfilePage() {
  const { userName, userEmail } = useAuth();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    university: "",
    student_id_str: "",
    kyc_status: "pending",
    face_registered: false,
    created_at: "",
  });
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", university: "", student_id_str: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    studentApi
      .getMe()
      .then((res) => {
        const d = res.data;
        setProfile(d);
        setEditForm({
          name: d.name || "",
          university: d.university || "",
          student_id_str: d.student_id_str || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileMsg({ type: "", text: "" });
    try {
      const res = await studentApi.updateProfile(editForm);
      setProfile((prev) => ({ ...prev, ...res.data }));
      setProfileMsg({ type: "success", text: "Profile updated successfully" });
      setEditing(false);
    } catch (err) {
      setProfileMsg({
        type: "error",
        text: err.response?.data?.detail || "Failed to update profile",
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: profile.name || "",
      university: profile.university || "",
      student_id_str: profile.student_id_str || "",
    });
    setEditing(false);
    setProfileMsg({ type: "", text: "" });
  };

  const handleChangePassword = async () => {
    if (passwords.new_password !== passwords.confirm_password) {
      setPassMsg({ type: "error", text: "New passwords do not match" });
      return;
    }
    setPassLoading(true);
    setPassMsg({ type: "", text: "" });
    try {
      await authApi.changePassword({
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      setPassMsg({ type: "success", text: "Password changed successfully" });
      setPasswords({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      setPassMsg({
        type: "error",
        text: err.response?.data?.detail || "Failed to change password",
      });
    } finally {
      setPassLoading(false);
    }
  };

  const initials = profile.name
    ? profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : (userEmail?.[0] || "S").toUpperCase();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", pb: 8 }}>
      <Container maxWidth="md" sx={{ pt: 5 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Chip
            label="My Profile"
            size="small"
            sx={{ mb: 1.5, bgcolor: "rgba(34,211,238,0.1)", color: "primary.main", fontWeight: 700 }}
          />
          <Typography variant="h4" fontWeight={800} color="text.primary">
            Account Settings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your personal information and account security.
          </Typography>
        </Box>

        {/* Profile Header Card */}
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
                  boxShadow: "0 4px 16px rgba(34,211,238,0.4)",
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight={800}>
                  {profile.name || userName || "Student"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {profile.email || userEmail}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    size="small"
                    label={`KYC: ${profile.kyc_status === "verified" ? "Verified" : "Pending"}`}
                    color={profile.kyc_status === "verified" ? "success" : "warning"}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={profile.face_registered ? "Face Enrolled" : "Face Not Enrolled"}
                    color={profile.face_registered ? "success" : "default"}
                    variant="outlined"
                  />
                  {profile.university && (
                    <Chip size="small" label={profile.university} variant="outlined" />
                  )}
                </Box>
              </Box>
              {profile.created_at && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                  <CalendarTodayIcon sx={{ fontSize: 14 }} />
                  <Typography variant="caption">
                    Joined {new Date(profile.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              <Tab
                icon={<AccountCircleIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Personal Info"
                sx={{ fontWeight: 600, minHeight: 56 }}
              />
              <Tab
                icon={<SecurityIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Security"
                sx={{ fontWeight: 600, minHeight: 56 }}
              />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* ── Personal Info Tab ── */}
            <TabPanel value={tab} index={0}>
              {profileMsg.text && (
                <Alert severity={profileMsg.type} sx={{ mb: 2, borderRadius: 2 }} onClose={() => setProfileMsg({ type: "", text: "" })}>
                  {profileMsg.text}
                </Alert>
              )}

              {!editing ? (
                <>
                  <Grid container spacing={3}>
                    {[
                      { label: "Full Name", value: profile.name, icon: <PersonIcon sx={{ fontSize: 18, color: "text.secondary" }} /> },
                      { label: "Email Address", value: profile.email, icon: <EmailIcon sx={{ fontSize: 18, color: "text.secondary" }} /> },
                      { label: "Student ID", value: profile.student_id_str || "—", icon: <BadgeIcon sx={{ fontSize: 18, color: "text.secondary" }} /> },
                      { label: "University", value: profile.university || "—", icon: <SchoolIcon sx={{ fontSize: 18, color: "text.secondary" }} /> },
                    ].map(({ label, value, icon }) => (
                      <Grid item xs={12} sm={6} key={label}>
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                          <Box sx={{ mt: 0.5 }}>{icon}</Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                              {label}
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              {value}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => setEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Full Name"
                        fullWidth
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="University"
                        fullWidth
                        value={editForm.university}
                        onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SchoolIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Student ID"
                        fullWidth
                        value={editForm.student_id_str}
                        onChange={(e) => setEditForm({ ...editForm, student_id_str: e.target.value })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email Address"
                        fullWidth
                        disabled
                        value={profile.email}
                        helperText="Email cannot be changed"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 3, display: "flex", gap: 1.5 }}>
                    <Button
                      variant="contained"
                      startIcon={profileSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                      onClick={handleProfileSave}
                      disabled={profileSaving || !editForm.name.trim()}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                      disabled={profileSaving}
                    >
                      Cancel
                    </Button>
                  </Box>
                </>
              )}
            </TabPanel>

            {/* ── Security Tab ── */}
            <TabPanel value={tab} index={1}>
              <Typography variant="h6" fontWeight={700} mb={0.5}>
                Change Password
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Choose a strong password with at least 8 characters.
              </Typography>

              {passMsg.text && (
                <Alert severity={passMsg.type} sx={{ mb: 2, borderRadius: 2 }} onClose={() => setPassMsg({ type: "", text: "" })}>
                  {passMsg.text}
                </Alert>
              )}

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 440 }}>
                <TextField
                  label="Current Password"
                  type={showCurrent ? "text" : "password"}
                  fullWidth
                  value={passwords.current_password}
                  onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowCurrent(!showCurrent)}>
                          {showCurrent ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="New Password"
                  type={showNew ? "text" : "password"}
                  fullWidth
                  value={passwords.new_password}
                  onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                  helperText="Min. 8 characters"
                  inputProps={{ minLength: 8 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowNew(!showNew)}>
                          {showNew ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={passwords.confirm_password}
                  onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                  error={
                    passwords.confirm_password.length > 0 &&
                    passwords.new_password !== passwords.confirm_password
                  }
                  helperText={
                    passwords.confirm_password.length > 0 &&
                    passwords.new_password !== passwords.confirm_password
                      ? "Passwords do not match"
                      : ""
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleChangePassword}
                  disabled={
                    passLoading ||
                    !passwords.current_password ||
                    !passwords.new_password ||
                    passwords.new_password !== passwords.confirm_password
                  }
                  sx={{ alignSelf: "flex-start" }}
                >
                  {passLoading ? <CircularProgress size={20} color="inherit" /> : "Update Password"}
                </Button>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" fontWeight={700} mb={1}>
                Account Info
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  { label: "Member Since", value: profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                  { label: "KYC Status", value: profile.kyc_status === "verified" ? "Verified" : "Pending" },
                  { label: "Biometric Auth", value: profile.face_registered ? "Enrolled" : "Not Enrolled" },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ display: "flex", justifyContent: "space-between", p: 1.5, bgcolor: "grey.50", borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>{label}</Typography>
                    <Typography variant="body2" fontWeight={600}>{value}</Typography>
                  </Box>
                ))}
              </Box>
            </TabPanel>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
