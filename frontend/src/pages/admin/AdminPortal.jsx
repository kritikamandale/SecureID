import { useState } from "react";
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
  Button,
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

export default function AdminPortal() {
  const [tabIndex, setTabIndex] = useState(0);

  const checkTab = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
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
                color: "#BF360C",
                fontWeight: 700,
              }}
            />
            <Typography variant="h4" fontWeight={800} color="text.primary">
              SecureVault Administration
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
              <Typography variant="h5" fontWeight={700} mb={3}>
                Blockchain Explorer
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  overflowX: "auto",
                  pb: 2,
                }}
              >
                {[
                  {
                    b: 19849855,
                    t: "0x8fa...d21",
                    h: "b2c7...8e1a",
                    genesis: true,
                  },
                  { b: 19849856, t: "0x91c...f8b", h: "1a9f...c28d" },
                  { b: 19849857, t: "0xa2d...e9c", h: "7f4c...3b1d" },
                  { b: 19849858, t: "0xb3e...a0d", h: "4e1a...7c9b" },
                  { b: "Pending", t: "Processing...", h: "Computing..." },
                ].map((block, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        p: 2.5,
                        minWidth: 220,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        bgcolor:
                          block.b === "Pending"
                            ? "background.paper"
                            : "#1e1e2d",
                        color:
                          block.b === "Pending" ? "text.secondary" : "#fff",
                        position: "relative",
                      }}
                    >
                      {block.genesis && (
                        <Chip
                          size="small"
                          label="Genesis"
                          sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            bgcolor: "#7c4dff",
                            color: "#fff",
                            fontSize: "0.65rem",
                          }}
                        />
                      )}
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{
                          color:
                            block.b === "Pending"
                              ? "text.secondary"
                              : "#90caf9",
                          mb: 1,
                        }}
                      >
                        Block #{block.b}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace", opacity: 0.9 }}
                      >
                        Tx: {block.t}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace", opacity: 0.9 }}
                      >
                        Hash: {block.h}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace", opacity: 0.7, mt: 1 }}
                      >
                        {block.b === "Pending"
                          ? "Awaiting consensus..."
                          : "Verified by 24 nodes"}
                      </Typography>
                    </Box>
                    {i < 4 && (
                      <Box
                        sx={{
                          mx: 2,
                          color: "text.secondary",
                          fontWeight: "bold",
                        }}
                      >
                        →
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
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
                CI/CD Pipeline Status Logging
              </Typography>
              <Typography variant="body2" color="text.secondary">
                GitHub Actions currently passing. All containers deployed to
                simulated production environment.
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
                System SECURE
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Zero-trust architecture enforced. JWT active. Passwords bcrypt
                hashed. Embeddings AES-256 encrypted.
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
                Technology Stack Overview
              </Typography>
              <Grid container spacing={3}>
                {[
                  "React.js (Frontend)",
                  "FastAPI (Backend)",
                  "PostgreSQL (Database)",
                  "JWT (Auth)",
                  "Docker (Container)",
                  "Python OpenCV (Biometrics)",
                ].map((tech) => (
                  <Grid item xs={6} md={4} key={tech}>
                    <Box
                      sx={{
                        p: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography fontWeight={600}>{tech}</Typography>
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
