import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import OnBoardlogo from "./OnBoardlogo";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "../services/api";
import { useState } from "react";
import { AxiosError } from "axios";
import { Link } from "@tanstack/react-router";
import { signUpSchema } from "../schema/userScshema";

export default function SignUPage() {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const {
    control,

    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      location: "",
      role: "",
    },
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setLoading(true);
    try {
      console.log("Form submitted with data:", data);
      const response = await signUp(data);
      console.log(response);

      // Show success message
      if (response.message) {
        showSnackbar(response.message, "success");
        // Store token if provided
        if (response.token) {
          localStorage.setItem("token", response.token);
          console.log("Token stored:", response.token);
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;

      if (axiosError.response) {
        const status = axiosError.response.status;
        const errorMessage =
          axiosError.response.data?.message || "An error occurred";

        switch (status) {
          case 409:
            if (errorMessage.includes("Email already exists")) {
              showSnackbar("Email already exists", "error");
            } else if (errorMessage.includes("Username already exists")) {
              showSnackbar("Username already exists", "error");
            } else {
              showSnackbar(errorMessage, "error");
            }
            break;
          case 401:
            showSnackbar("Invalid user credentials", "error");
            break;
          case 400:
            const errorData = axiosError.response.data as {
              details?: Array<{ field: string; message: string }>;
            };
            if (errorData.details && errorData.details.length > 0) {
              showSnackbar(
                errorData.details.map((d) => d.message).join(", "),
                "error"
              );
            } else {
              showSnackbar(errorMessage, "error");
            }
            break;
          case 500:
            showSnackbar("Server error. Please try again later.", "error");
            break;
          default:
            showSnackbar(errorMessage, "error");
            break;
        }
      } else {
        showSnackbar("Network error. Please check your connection.", "error");
      }
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Left side with #2F80ED color */}
      <OnBoardlogo />
      {/* Right side with white color */}
      <Box
        p={0}
        m={0}
        sx={{
          flex: 1,
          backgroundColor: "white",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box sx={{ padding: "18px", width: "604px", height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p>Welcome</p>
            <p style={{ fontWeight: "600", color: "black", fontSize: "24px" }}>
              Sign Up your Account
            </p>
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",

                marginTop: "20px",
                marginBottom: "20px",

                gap: "20px",
              }}
            >
              <Controller
                name="role"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Button
                    sx={{
                      borderRadius: "30px",
                      width: "308px",
                      textTransform: "capitalize",
                      fontSize: "18px",
                    }}
                    variant={value === "customer" ? "contained" : "outlined"}
                    onClick={() => onChange("customer")}
                    onBlur={onBlur}
                  >
                    Customer/Entrepreneur
                  </Button>
                )}
              />
              <Controller
                name="role"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Button
                    sx={{
                      borderRadius: "30px",
                      width: "308px",
                      textTransform: "capitalize",
                      fontSize: "18px",
                    }}
                    variant={value === "creator" ? "contained" : "outlined"}
                    onClick={() => onChange("creator")}
                    onBlur={onBlur}
                  >
                    UGC Content Creator
                  </Button>
                )}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "26px" }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                marginTop: "10px",
              }}
            >
              <Controller
                name="firstName"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    color="primary"
                    sx={{ width: "50%" }}
                    id="outlined-basic"
                    label="First Name"
                    variant="outlined"
                    size="small"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value || ""}
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />

              <Controller
                name="lastName"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextField
                    color="primary"
                    sx={{ width: "50%" }}
                    id="filled-basic"
                    label="Last Name"
                    variant="outlined"
                    size="small"
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value || ""}
                    error={!!errors.firstName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Box>
            <Controller
              name="location"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Autocomplete
                  disablePortal
                  color="primary"
                  size="small"
                  sx={{ width: "100%" }}
                  options={["UK", "Nepal"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Location"
                      error={!!errors.location}
                      helperText={errors.location?.message}
                    />
                  )}
                  onChange={(_event, newValue) => {
                    onChange(newValue || "");
                  }}
                  onBlur={onBlur}
                  value={value || null}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  color="primary"
                  sx={{ width: "100%" }}
                  id="filled-basic"
                  label="Email"
                  variant="outlined"
                  size="small"
                  type="email"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value || ""}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  color="primary"
                  sx={{ width: "100%" }}
                  id="filled-basic"
                  label="Password"
                  variant="outlined"
                  size="small"
                  type="password"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value || ""}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  color="primary"
                  sx={{ width: "100%" }}
                  id="filled-basic"
                  label="Confirm Password"
                  variant="outlined"
                  size="small"
                  type="password"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value || ""}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />
          </Box>
          <Button
            title="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            sx={{
              backgroundColor: "#2F80ED",
              borderRadius: "30px",
              width: "100%",
              marginTop: "20px",
              textTransform: "capitalize",
              fontSize: "18px",
            }}
            variant="contained"
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "SignUp"
            )}
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
              gap: "5px",
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Already have an account?{" "}
            </Typography>
            <Link
              to="/login"
              style={{
                color: "#2F80ED",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
              className="login-link"
            >
              Login
            </Link>
          </Box>
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
    </Box>
  );
}
