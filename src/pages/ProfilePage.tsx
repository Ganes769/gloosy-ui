import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import ResponsiveAppBar from "../components/AppNavbar";
import {
  CameraAlt,
  Description,
  AttachMoney,
  ArrowForward,
} from "@mui/icons-material";
import { fetchCurrentUser } from "../services/userResource";
import { useNavigate } from "@tanstack/react-router";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchCurrentUser();
        setProfile(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const getRoleDisplay = (role: string) =>
    role === "creator" ? "UGC Creator" : "Customer/Entrepreneur";

  if (loading) {
    return (
      <>
        <ResponsiveAppBar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 64px)",
            backgroundColor: "#F8FAFC",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <ResponsiveAppBar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 64px)",
            backgroundColor: "#F8FAFC",
          }}
        >
          <Typography variant="h6">Failed to load profile</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <ResponsiveAppBar />
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#F8FAFC",
          py: 4,
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          {/* Left Sidebar */}
          <Box
            sx={{
              width: { xs: "100%", lg: 350 },
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Profile Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Box sx={{ position: "relative", mb: 2 }}>
                <Avatar
                  src={profile.profilePicture}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  sx={{
                    width: 120,
                    height: 120,
                    border: "3px solid #E0E0E0",
                  }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "#346DFF",
                    color: "white",
                    width: 36,
                    height: 36,
                    "&:hover": {
                      backgroundColor: "#2800C6",
                    },
                  }}
                >
                  <CameraAlt sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  color: "#1A1A1A",
                }}
              >
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#666",
                  mb: 2,
                  fontWeight: 500,
                }}
              >
                {getRoleDisplay(profile.role)}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#346DFF",
                }}
              >
                0
              </Typography>
            </Paper>

            {/* Active Orders Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  backgroundColor: "#4CAF50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Description sx={{ color: "white", fontSize: 28 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", mb: 0.5, fontSize: "0.875rem" }}
                >
                  Active orders
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#4CAF50" }}
                >
                  0
                </Typography>
              </Box>
            </Paper>

            {/* Earnings This Month Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: "#FFC107",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AttachMoney sx={{ color: "white", fontSize: 28 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", mb: 0.5, fontSize: "0.875rem" }}
                >
                  Earnings this month
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "#FFC107" }}
                >
                  0€
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Welcome Banner */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                background: "linear-gradient(135deg, #346DFF 0%, #2800C6 100%)",
                color: "white",
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                Welcome
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  mb: 2,
                  opacity: 0.95,
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                }}
              >
                we are so excited to have you here
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  opacity: 0.9,
                  lineHeight: 1.8,
                  fontSize: { xs: "0.95rem", md: "1rem" },
                }}
              >
                Gloosy is designed specifically for creators like you. Get access
                to exclusive opportunities, connect with brands, and grow your
                creative career.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  color: "#346DFF",
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                  },
                }}
                onClick={() => navigate({ to: "/updateProfile" })}
              >
                View profile
              </Button>
            </Paper>

            {/* Active Orders Section */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 300,
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  backgroundColor: "#F5F5F5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <Description sx={{ fontSize: 64, color: "#999" }} />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: "#1A1A1A",
                }}
              >
                No active orders
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  mb: 3,
                }}
              >
                Browse UGC requests
              </Typography>
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #346DFF 0%, #2800C6 100%)",
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    background: "linear-gradient(135deg, #2800C6 0%, #346DFF 100%)",
                  },
                }}
                endIcon={<ArrowForward />}
              >
                Browse requests
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
}
