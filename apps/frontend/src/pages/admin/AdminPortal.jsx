import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import Dashboard from "./Dashboard";
import StudentList from "./StudentList";
import AuthLogs from "./AuthLogs";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import LinkIcon from "@mui/icons-material/Link";
import SecurityIcon from "@mui/icons-material/Security";
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard";
import { adminApi } from "../../services/api";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function BlockchainExplorer() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .students()
      .then((r) => setStudents(r.data))
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, []);

  const enrolledStudents = students.filter((s) => s.face_registered);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Students with Blockchain Records
      </Typography>
      {enrolledStudents.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 6,
            gap: 1,
          }}
        >
          <LinkIcon sx={{ fontSize: 48, color: "text.disabled" }} />
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            No blockchain records yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Records appear here after students complete face authentication.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {enrolledStudents.map((s) => (
            <Box
              key={s.id}
              sx={{
                p: 2.5,
                minWidth: 220,
                borderRadius: 2,
                bgcolor: "background.paper",
                color: "text.primary",
                border: "1px solid rgba(237, 242, 247, 0.08)",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ color: "primary.main", mb: 0.5 }}
              >
                {s.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", opacity: 0.8 }}
              >
                {s.email}
              </Typography>
              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                <Chip
                  size="small"
                  label="KYC Verified"
                  sx={{ bgcolor: "rgba(0,200,83,0.2)", color: "#69F0AE", fontSize: "0.65rem" }}
                />
                <Chip
                  size="small"
                  label="Face Enrolled"
                  sx={{ bgcolor: "rgba(34,211,238,0.15)", color: "#22d3ee", fontSize: "0.65rem" }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function AdminPortal() {
  const [tabIndex, setTabIndex] = useState(0);

  const checkTab = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ minHeight: "100vh", pb: 8 }}>
      <Container maxWidth="xl" sx={{ pt: 5 }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Box>
            <Chip
              label="Admin Console"
              size="small"
              sx={{
                mb: 1.5,
                bgcolor: "rgba(255,112,67,0.1)",
                color: "#22d3ee",
                fontWeight: 700,
              }}
            />
            <Typography variant="h4" fontWeight={800} color="text.primary">
              SECUREID Administration
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Global overview, user management, and system health.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabIndex}
            onChange={checkTab}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<DashboardIcon sx={{ mr: 1 }} />}
              iconPosition="start"
              label="Overview"
              sx={{ fontWeight: 600, minHeight: 48 }}
            />
            <Tab
              icon={<PeopleIcon sx={{ mr: 1 }} />}
              iconPosition="start"
              label="Students"
              sx={{ fontWeight: 600, minHeight: 48 }}
            />
            <Tab
              icon={<ReceiptIcon sx={{ mr: 1 }} />}
              iconPosition="start"
              label="Auth Logs"
              sx={{ fontWeight: 600, minHeight: 48 }}
            />
            <Tab
              icon={<LinkIcon sx={{ mr: 1 }} />}
              iconPosition="start"
              label="Blockchain"
              sx={{ fontWeight: 600, minHeight: 48 }}
            />
            <Tab
              icon={<CloudQueueIcon sx={{ mr: 1 }} />}
              iconPosition="start"
              label="CI/CD"
              sx={{ fontWeight: 600, minHeight: 48 }}
            />
            <Tab
              icon={<SecurityIcon sx={{ mr: 1 }} />}
              iconPosition="start"
              label="Security"
              sx={{ fontWeight: 600, minHeight: 48 }}
            />
            <Tab
              icon={<DeveloperBoardIcon sx={{ mr: 1 }} />}
              iconPosition="start"
              label="Tech Stack"
              sx={{ fontWeight: 600, minHeight: 48 }}
            />
          </Tabs>
        </Box>

        <TabPanel value={tabIndex} index={0}>
          <Dashboard />
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
          >
            <CardContent>
              <StudentList />
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          <AuthLogs />
        </TabPanel>

        <TabPanel value={tabIndex} index={3}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
          >
            <CardContent sx={{ p: 4 }}>
              <BlockchainExplorer />
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabIndex} index={4}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
          >
            <CardContent
              sx={{
                p: 4,
                height: 400,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CloudQueueIcon
                sx={{
                  fontSize: 64,
                  color: "text.secondary",
                  mb: 2,
                  opacity: 0.5,
                }}
              />
              <Typography variant="h6" color="text.secondary">
                CI/CD Pipeline
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Run tests locally with <code>pytest</code> in <code>backend/</code> and <code>face-service/</code>.
                Docker images build via <code>docker compose up --build</code>.
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabIndex} index={5}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
          >
            <CardContent
              sx={{
                p: 4,
                height: 400,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SecurityIcon
                sx={{
                  fontSize: 64,
                  color: "success.main",
                  mb: 2,
                  opacity: 0.8,
                }}
              />
              <Typography variant="h6" color="success.main">
                System Secured
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1, maxWidth: 400 }}>
                JWT bearer tokens on all protected routes · Passwords hashed with bcrypt ·
                Admin endpoints require admin role · CORS restricted to configured origins ·
                Admin self-registration blocked
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabIndex} index={6}>
          <Card
            sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={700} mb={3}>
                Technology Stack
              </Typography>
              <Grid container spacing={3}>
                {[
                  { label: "React 18 + Vite", desc: "Frontend SPA" },
                  { label: "FastAPI", desc: "Backend REST API" },
                  { label: "SQLAlchemy + SQLite/PostgreSQL", desc: "Database ORM" },
                  { label: "JWT (python-jose)", desc: "Authentication" },
                  { label: "DeepFace", desc: "Face recognition microservice" },
                  { label: "Hardhat + Solidity", desc: "Blockchain ledger" },
                  { label: "Material UI v7", desc: "Component library" },
                  { label: "Docker Compose", desc: "Local orchestration" },
                  { label: "bcrypt (passlib)", desc: "Password hashing" },
                ].map((tech) => (
                  <Grid item xs={6} md={4} key={tech.label}>
                    <Box
                      sx={{
                        p: 2.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Typography fontWeight={700} variant="body2">
                        {tech.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {tech.desc}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </TabPanel>
      </Container>
    </Box>
  );
}
