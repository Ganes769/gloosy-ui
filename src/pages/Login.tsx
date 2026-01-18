import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import OnBoardlogo from "./OnBoardlogo";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "@tanstack/react-router";
import { loginschema } from "../schema/userScshema";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
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

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginschema>>({
    resolver: zodResolver(loginschema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const onSubmit = async (data: z.infer<typeof loginschema>) => {
    setLoading(true);
    try {
      await authLogin(data.email, data.password);
      showSnackbar("Login successful", "success");
      navigate({ to: "/updateProfile" });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;

      if (axiosError.response) {
        const status = axiosError.response.status;
        const errorMessage =
          axiosError.response.data?.message || "An error occurred";

        switch (status) {
          case 401:
            showSnackbar("Invalid email or password", "error");
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
      console.error("Login error:", error);
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
      <OnBoardlogo />

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
              Login to your Account
            </p>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "26px",
              marginTop: "40px",
            }}
          >
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
              "Login"
            )}
          </Button>
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
