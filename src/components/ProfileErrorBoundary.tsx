import React from "react";
import { Typography, Box } from "@mui/material";

export class ProfileErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Typography color="error">Failed to load profile.</Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}
