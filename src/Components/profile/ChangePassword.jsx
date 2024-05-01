import { Box, Typography } from "@mui/material";
import { Button } from "@material-tailwind/react";
import { useState } from "react";
import { handleForgotPassword } from "../../lib/firebase";

const ChangePassword = ({ setSnackBar,currentUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    setIsLoading(true);
    const email = currentUser.email;
    const message =await handleForgotPassword(email)
    setSnackBar(message);
    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "97%",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        marginTop: "20px",
        marginBottom: "20px",
        mx: "auto",
        p: 4,
        position: "relative",
        zIndex: "1",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        boxSizing: "border-box",
        border: "1px solid #e0e0e0",
        color: "black",
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "24px",
      }}
    >
      <Typography sx={{ lineHeight: "1.5", fontSize: "1.5em" }}>
        Send Mail To Chnage Password
      </Typography>
     
        <Box >
          <Button color="blue" disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "Loading..." : "Send Mail"}
          </Button>
        </Box>
    </Box>
  );
};

export default ChangePassword;
