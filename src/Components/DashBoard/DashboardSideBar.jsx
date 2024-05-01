import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../hooks/AuthContext";
import { Box, Avatar, Typography } from "@mui/material";
import { Button } from "@material-tailwind/react";
import { SnackBarContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Logout, suggestionList } from "../../lib/firebase";

const DashboardSideBar = () => {
  const { currentUser } = useContext(AuthContext);
  const { setSnackBar } = useContext(SnackBarContext);
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState([]);

  useEffect(() => {
    const handleSuggestion = async () => {
      const following = currentUser?.following || [];
      following.push(currentUser?.uid);
      const list = await suggestionList(following);
      setSuggestion(list);
    };

    handleSuggestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.following]);

  const handleLogout = async () => {
    const res = await Logout();
    if (res) {
      setSnackBar({
        message: "Logout Succesfully...",
        open: true,
        style: "success",
      });
    } else {
      setSnackBar({
        message: "Logout Failed...",
        open: true,
        style: "error",
      });
    }
  };

  const handleProfile = (userId) => {
    navigate(`/Profile/${userId}`);
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box
        sx={{
          pl:2,
          height: "20%",
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          gap:1
        }}
      >
        <Avatar
          src={currentUser.picture}
          sx={{ width: "50px", height: "50px", cursor: "pointer" }}
          onClick={() => handleProfile(currentUser?.userId)}
        />
        <Box>
          <Typography
            variant="h6"
            className="cursor-pointer"
            onClick={() => handleProfile(currentUser?.userId)}
          >
            {currentUser?.userId || "Test"}
          </Typography>
          <Typography variant="body1" sx={{maxWidth:'90%'}} className="cursor-pointer">
            {currentUser?.bio || "Test"}
          </Typography>
        </Box>
        <Button color="red" onClick={handleLogout} className="min-w-[105px]">
          Log out
        </Button>
      </Box>
      <Box
        sx={{
          height: "80%",
          width: "100%",
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ lineHeight: "1.5", fontSize: "2em" }}>
          suggestion List
        </Typography>
        {suggestion && suggestion.length > 0 ? (
          suggestion?.map((item, index) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                }}
                key={index}
                className="space-x-3"
              >
                <Avatar
                  src={suggestion[index]?.picture}
                  sx={{ width: "50px", height: "50px", cursor: "pointer" }}
                  onClick={() => handleProfile(suggestion[index]?.userId)}
                />
                <Box>
                  <Typography
                    variant="h6"
                    className="cursor-pointer"
                    onClick={() => handleProfile(suggestion[index]?.userId)}
                  >
                    {suggestion[index]?.userId || "test"}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "200px",
                    }}
                  >
                    {suggestion[index]?.bio}
                  </Typography>
                </Box>
              </Box>
            );
          })
        ) : (
          <Typography>Loading suggestions...</Typography>
        )}
      </Box>
    </Box>
  );
};

export default DashboardSideBar;
