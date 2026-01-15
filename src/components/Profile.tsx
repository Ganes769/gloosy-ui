// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import ResponsiveAppBar from "../components/AppNavbar";
import { Email, CalendarToday, Work, Person, Star } from "@mui/icons-material";
import { fetchCurrentUser } from "../services/userResource";

export default function Profile() {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
        <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 3,
              background: "linear-gradient(135deg, #346DFF 0%, #2800C6 100%)",
              color: "white",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "center", md: "flex-start" },
                gap: 3,
              }}
            >
              <Avatar
                src={profile.profilePicture}
                alt={`${profile.firstName} ${profile.lastName}`}
                sx={{
                  width: { xs: 120, md: 150 },
                  height: { xs: 120, md: 150 },
                  border: "4px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              />
              <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  {profile.firstName} {profile.lastName}
                </Typography>

                <Chip
                  label={getRoleDisplay(profile.role)}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontWeight: 600,
                    mb: 2,
                    fontSize: "0.9rem",
                    height: 32,
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Email sx={{ fontSize: 20 }} />
                    <Typography variant="body1">{profile.email}</Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Person sx={{ fontSize: 20 }} />
                    <Typography variant="body1">@{profile.userName}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Additional Profile Information */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Date of Birth */}
            {profile.dateOfBirth && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #346DFF 0%, #2800C6 100%)",
                  color: "white",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CalendarToday sx={{ fontSize: 28 }} />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ opacity: 0.9, fontSize: "0.875rem", mb: 0.5 }}
                    >
                      Date of Birth
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {formatDate(profile.dateOfBirth)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Description */}
            {profile.description && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #346DFF 0%, #2800C6 100%)",
                  color: "white",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 2, fontSize: "1.1rem" }}
                >
                  About
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    whiteSpace: "pre-wrap",
                    opacity: 0.95,
                  }}
                >
                  {profile.description}
                </Typography>
              </Paper>
            )}

            {/* Skills & Experience */}
            {(profile.primarySkill || profile.experience !== undefined) && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #346DFF 0%, #2800C6 100%)",
                  color: "white",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 3, fontSize: "1.1rem" }}
                >
                  Skills & Experience
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 3,
                  }}
                >
                  {profile.primarySkill && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flex: 1,
                        p: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        borderRadius: 2,
                      }}
                    >
                      <Work sx={{ fontSize: 32 }} />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ opacity: 0.9, mb: 0.5, fontSize: "0.875rem" }}
                        >
                          Primary Skill
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {profile.primarySkill}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {profile.experience !== undefined && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flex: 1,
                        p: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        borderRadius: 2,
                      }}
                    >
                      <Star sx={{ fontSize: 32 }} />
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ opacity: 0.9, mb: 0.5, fontSize: "0.875rem" }}
                        >
                          Experience
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {profile.experience}{" "}
                          {profile.experience === 1 ? "Year" : "Years"}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
