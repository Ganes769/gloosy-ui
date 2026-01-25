import {
  Box,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Link,
  InputAdornment,
} from "@mui/material";
import {
  CameraAlt,
  Facebook,
  LinkedIn,
  Twitter,
  Instagram,
  YouTube,
  ArrowForward,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef, useEffect } from "react";
import ResponsiveAppBar from "../components/AppNavbar";
import { profileUpdateSchema } from "../schema/userScshema";
import type { z } from "zod";
import { updateProfile, getCurrentUser } from "../services/api";
import imageCompression from "browser-image-compression";
import { useNavigate } from "@tanstack/react-router";

type ProfileFormData = z.infer<typeof profileUpdateSchema>;

const steps = ["Personal Info", "Skills", "Terms & Conditions"];

export default function UpdateProfile() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] =
    useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // // Check if user profile already exists and redirect to dashboard if it does
  // useEffect(() => {
  //   const checkExistingProfile = async () => {
  //     try {
  //       const userData = await getCurrentUser();
  //       // Check if essential profile fields exist
  //       if (
  //         userData?.firstName &&
  //         userData?.lastName &&
  //         userData?.userName &&
  //         userData?.role
  //       ) {
  //         // Profile already exists, redirect to dashboard
  //         navigate({ replace: true, to: "/" });
  //         return;
  //       }
  //     } catch (error) {
  //       // If there's an error fetching user data, continue to show the form
  //       console.error("Error checking profile:", error);
  //     } finally {
  //       setCheckingProfile(false);
  //     }
  //   };

  //   checkExistingProfile();
  // }, [navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      description: "",
      dateOfBirth: "",
      role: "",
      primarySkill: undefined,
      secondSkill: "",
      experience: 0,
      profilePicture: "",
    },
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info",
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!termsAccepted) {
      showSnackbar("Please accept the Terms and Conditions", "error");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for multipart/form-data upload
      const formData = new FormData();

      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("userName", data.userName);
      formData.append("dateOfBirth", new Date(data.dateOfBirth).toISOString());
      formData.append("description", data.description || "");
      if (data.primarySkill) {
        formData.append("primarySkill", data.primarySkill);
      }
      formData.append("experience", data.experience.toString());

      // Handle profile picture - compress and add as file if available
      if (profilePicture) {
        try {
          // Compress the image before upload
          const options = {
            maxSizeMB: 0.5, // Maximum size in MB (500KB)
            maxWidthOrHeight: 800, // Maximum width or height
            useWebWorker: true, // Use web worker for better performance
            fileType: "image/jpeg", // Convert to JPEG for better compression
          };

          const compressedFile = await imageCompression(
            profilePicture,
            options,
          );
          formData.append(
            "profilePicture",
            compressedFile,
            compressedFile.name,
          );
        } catch (compressionError) {
          console.error("Image compression error:", compressionError);
          showSnackbar(
            "Failed to compress image. Please try again with a smaller image.",
            "error",
          );
          setLoading(false);
          return;
        }
      } else if (data.profilePicture && !profilePicturePreview) {
        // If there's an existing profile picture URL, send it as a string
        formData.append("profilePicture", data.profilePicture);
      }

      console.log("Sending FormData with compressed image");

      const response = await updateProfile(formData);

      if (response.status === 200) {
        if (response.data.message && response.data.userProfile) {
          showSnackbar(
            response.data.message || "User profile updated successfully",
            "success",
          );
        } else {
          showSnackbar("Profile updated successfully", "success");
        }
        // Navigate to home page on successful update
        navigate({ replace: true, to: "/" });
      }
    } catch (error: any) {
      let errorMessage = "Failed to update profile. Please try again.";

      if (error.response?.status === 413) {
        errorMessage =
          "Image file is too large. Please select a smaller image or try again without a profile picture.";
      } else {
        errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to update profile. Please try again.";
      }

      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof ProfileFormData)[] = [];

    if (activeStep === 0) {
      fieldsToValidate = [
        "firstName",
        "lastName",
        "userName",
        "description",
        "dateOfBirth",
        "role",
      ];
    } else if (activeStep === 1) {
      fieldsToValidate = ["primarySkill", "secondSkill", "experience"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleProfilePictureChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 10MB before compression)
      if (file.size > 10 * 1024 * 1024) {
        showSnackbar(
          "Image is too large. Please select an image smaller than 10MB.",
          "error",
        );
        return;
      }

      try {
        // Compress the image for preview and store original for upload
        const options = {
          maxSizeMB: 0.5, // Maximum size in MB (500KB)
          maxWidthOrHeight: 800, // Maximum width or height
          useWebWorker: true, // Use web worker for better performance
          fileType: "image/jpeg", // Convert to JPEG for better compression
        };

        const compressedFile = await imageCompression(file, options);
        setProfilePicture(compressedFile);

        // Create preview from compressed file
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfilePicturePreview(e.target?.result as string);
        };
        reader.onerror = () => {
          showSnackbar("Failed to process image. Please try again.", "error");
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Image compression error:", error);
        showSnackbar("Failed to process image. Please try again.", "error");
      }
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={profilePicturePreview}
                  sx={{
                    width: 120,
                    height: 120,
                    border: "3px solid",

                    borderStyle: "solid",
                  }}
                />
                <IconButton
                  onClick={handleProfilePictureClick}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background:
                      "linear-gradient(135deg, #346DFF 0%, #2800C6 100%)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #2800C6 0%, #346DFF 100%)",
                    },
                  }}
                >
                  <CameraAlt />
                </IconButton>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  style={{ display: "none" }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                }}
              >
                Personal Information
              </Typography>
            </Box>

            {/* Form Fields */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  )}
                />
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  )}
                />
              </Box>

              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Username"
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={!!errors.userName}
                    helperText={errors.userName?.message}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>@</Typography>,
                    }}
                  />
                )}
              />

              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Date of Birth"
                    type="date"
                    variant="outlined"
                    fullWidth
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                  />
                )}
              />

              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Role"
                    variant="outlined"
                    fullWidth
                    size="small"
                    select
                    error={!!errors.role}
                    helperText={errors.role?.message}
                  >
                    <MenuItem value="customer">Customer/Entrepreneur</MenuItem>
                    <MenuItem value="creator">UGC Content Creator</MenuItem>
                  </TextField>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    size="small"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    placeholder="Tell us about your work experience and background..."
                  />
                )}
              />
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Skills & Experience
            </Typography>

            <Controller
              name="primarySkill"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Primary Skill"
                  variant="outlined"
                  fullWidth
                  size="small"
                  select
                  error={!!errors.primarySkill}
                  helperText={errors.primarySkill?.message}
                >
                  <MenuItem value="Video creation">Video creation</MenuItem>
                  <MenuItem value="Photo Creation">Photo Creation</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="secondSkill"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Second Skill"
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.secondSkill}
                  helperText={errors.secondSkill?.message}
                  placeholder="e.g., Graphic Design, Writing, etc."
                />
              )}
            />

            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Experience (Years)"
                  variant="outlined"
                  fullWidth
                  size="small"
                  type="number"
                  inputProps={{ min: 0, max: 50 }}
                  error={!!errors.experience}
                  helperText={errors.experience?.message}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Terms & Conditions
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please read and accept our terms and conditions to continue.
            </Typography>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                p: 2,
                maxHeight: 300,
                overflow: "auto",
              }}
            >
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {`Terms and Conditions

1. Acceptance of Terms
By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.

2. Use License
Permission is granted to temporarily use this service for personal, non-commercial transitory viewing only.

3. User Account
You are responsible for maintaining the confidentiality of your account and password.

4. Content
You agree not to post any content that is illegal, harmful, or violates any rights.

5. Privacy
Your use of this service is also governed by our Privacy Policy.

6. Modifications
We reserve the right to modify these terms at any time.

By accepting these terms, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.`}
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  sx={{
                    color: "#346DFF",
                    "&.Mui-checked": {
                      color: "#346DFF",
                    },
                  }}
                />
              }
              label="I accept the Terms and Conditions"
            />
          </Box>
        );

      default:
        return null;
    }
  };

  // // Show loading state while checking profile
  // if (checkingProfile) {
  //   return (
  //     <>
  //       <ResponsiveAppBar />
  //       <Box
  //         sx={{
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           minHeight: "calc(100vh - 64px)",
  //           backgroundColor: "#F8FAFC",
  //         }}
  //       >
  //         <CircularProgress />
  //       </Box>
  //     </>
  //   );
  // }

  return (
    <>
      <ResponsiveAppBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#F8FAFC",
          p: 4,
          flex: 1,
        }}
      >
        <Box
          sx={{
            maxWidth: 800,
            width: "100%",
            margin: "0 auto",
            backgroundColor: "white",
            borderRadius: 2,
            p: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel sx={{ color: "#346DFF" }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent(activeStep)}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
              }}
            >
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  variant="outlined"
                  sx={{
                    borderColor: "#346DFF",
                    color: "#346DFF",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #2800C6 0%, #346DFF 100%)",
                      backgroundColor: "rgba(52, 109, 255, 0.04)",
                    },
                  }}
                >
                  Back
                </Button>
              )}
              {activeStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(135deg, #346DFF 0%, #2800C6 100%)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #2800C6 0%, #346DFF 100%)",
                    },
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    background:
                      "linear-gradient(135deg, #346DFF 0%, #2800C6 100%)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #2800C6 0%, #346DFF 100%)",
                    },
                    "&:disabled": {
                      background:
                        "linear-gradient(135deg, #346DFF 0%, #2800C6 100%)",
                      opacity: 0.6,
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Professional Footer */}
      <Box
        component="footer"
        sx={{
          background: "linear-gradient(135deg, #346DFF 0%, #2800C6 100%)",
          color: "white",
          mt: "auto",
          py: 6,
        }}
      >
        <Box sx={{ maxWidth: 1200, margin: "0 auto", px: 3 }}>
          {/* Newsletter Subscription Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              mb: 5,
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Subscribe to Gloosy
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Get the newsletters and guides directly on your email from us.
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                width: { xs: "100%", md: "auto" },
              }}
            >
              <TextField
                placeholder="Your email address"
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: "white",
                  borderRadius: 1,
                  width: { xs: "100%", md: 300 },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        sx={{
                          background:
                            "linear-gradient(135deg, #346DFF 0%, #2800C6 100%)",
                          color: "white",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #2800C6 0%, #346DFF 100%)",
                          },
                        }}
                      >
                        <ArrowForward />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>

          {/* Main Footer Content */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              mb: 4,
            }}
          >
            {/* Gloosy Branding */}
            <Box
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 16px)",
                  md: "1 1 calc(25% - 24px)",
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Gloosy
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Your One-Stop UGC Hub !
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  <Facebook fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  <LinkedIn fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  <Twitter fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  <Instagram fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  <YouTube fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Insights */}
            <Box
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 16px)",
                  md: "0 0 auto",
                },
                minWidth: { md: 150 },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Insights
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    opacity: 0.9,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  For Creators
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    opacity: 0.9,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  For Companies
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    opacity: 0.9,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  FAQs
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    opacity: 0.9,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Blogs
                </Link>
              </Box>
            </Box>

            {/* Legals */}
            <Box
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 16px)",
                  md: "0 0 auto",
                },
                minWidth: { md: 150 },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Legals
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    opacity: 0.9,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Privacy Policies
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    opacity: 0.9,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    opacity: 0.9,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Help & Supports
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    opacity: 0.9,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Payroll Services
                </Link>
              </Box>
            </Box>

            {/* Company */}
            <Box
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 16px)",
                  md: "0 0 auto",
                },
                minWidth: { md: 150 },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Company
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    opacity: 0.9,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  About Us
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    opacity: 0.9,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Careers
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    opacity: 0.9,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Social Responsibilities
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    opacity: 0.9,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Feedbacks
                </Link>
              </Box>
            </Box>

            {/* Contact Us */}
            <Box
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 16px)",
                  md: "1 1 calc(25% - 24px)",
                },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Contact Us
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Berlin, Germany
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +1 98000 0000 0000
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  UGChub@gmail.com
                </Typography>
                <Link
                  href="#"
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    opacity: 0.9,
                    fontWeight: 500,
                    "&:hover": { opacity: 1, textDecoration: "underline" },
                  }}
                >
                  Reach Out to Us
                </Link>
              </Box>
            </Box>
          </Box>

          {/* Bottom Section */}
          <Box
            sx={{
              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              pt: 3,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              © 2023 UGC®. All Rights Reserved
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Link
                href="#"
                sx={{
                  color: "white",
                  textDecoration: "none",
                  opacity: 0.9,
                  "&:hover": { opacity: 1, textDecoration: "underline" },
                }}
              >
                Google Play
              </Link>
              <Link
                href="#"
                sx={{
                  color: "white",
                  textDecoration: "none",
                  opacity: 0.9,
                  "&:hover": { opacity: 1, textDecoration: "underline" },
                }}
              >
                App Store
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
