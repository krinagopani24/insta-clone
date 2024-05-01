import { Box, Skeleton } from "@mui/material";

const ProfileLoading = () => {
  return (
    <Box
      spacing={1}
      className="w-svw h-svh relative"
      sx={{
        bgcolor: "#DEE1E1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Skeleton variant="rounded" width={"90vw"} height={"90vh"} />
    </Box>
  );
};

export default ProfileLoading;
