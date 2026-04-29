import { Box, Typography } from "@mui/material";

export const Unauthorized = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography variant="h6" color="text.secondary">
        認証済みユーザではありません
      </Typography>
    </Box>
  );
};

export default Unauthorized;
