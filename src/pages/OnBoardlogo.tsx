import { Box } from "@mui/material";

import logo from "../assets/images/onboarding.png";
export default function OnBoardlogo() {
  return (
    <Box
      p={0}
      m={0}
      sx={{
        flex: 1,
        backgroundColor: "#2F80ED",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <img
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "pointer",
        }}
        height={621}
        width={548}
        src={logo}
      />
    </Box>
  );
}
