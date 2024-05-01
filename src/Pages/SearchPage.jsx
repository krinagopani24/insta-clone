import {
  Box,
  Paper,
  InputBase,
  Divider,
  IconButton,
  Avatar,
  Typography,
} from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import { useState } from "react";
import useSearchUser from "../hooks/useSearchUser";
import { useNavigate } from "react-router-dom";

const SearchPage = () => {
  const [search, setSearch] = useState("");
  const { user, isLoading, getUserProfile } = useSearchUser();
  const navigate = useNavigate();
  const handleSearch = async () => {
    console.log(search);
    await getUserProfile(search);
    console.log(user);
  };

  const handleClick = (user) => {
    navigate(`/Profile/${user}`);
  };

  return (
    <Box sx={{ width: "100%", height: "100%", alignItems: "center" }}>
      <Box
        sx={{
          height: "70%",
          width: "40%",
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
        <Paper
          component="form"
          sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}
          className="w-full"
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search by User Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            inputProps={{ "aria-label": "Search User..." }}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton
            type="button"
            sx={{
              p: "10px",
              "&:hover": { color: "blueviolet" },
            }}
            disabled={isLoading}
            aria-label="Send"
            onClick={handleSearch}
          >
            <TelegramIcon />
          </IconButton>
        </Paper>
        <Box>
          <Box sx={{ maxHeight: "400px", overflow: "auto", mt: 2 }}>
            {isLoading ? (
              <Typography>Loading users...</Typography>
            ) : user && user.length > 0 ? (
              user?.map((user, index) => {
                console.log(user, index);
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      bgcolor: "#D1E1E1",
                      p: 1,
                      m: 1,
                      borderRadius: 5,
                      ":hover": {
                        bgcolor: "#C7E1E1",
                      },
                    }}
                    className="space-x-4"
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src={user.picture}
                      sx={{ width: 56, height: 56, cursor: "pointer" }}
                      onClick={() => handleClick(user.userId)}
                    />
                    <Divider
                      variant="fullWidth"
                      flexItem
                      orientation="vertical"
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: 54,
                      }}
                    >
                      <Typography
                        sx={{
                          lineHeight: "1",
                          fontSize: "1.2em",
                          cursor: "pointer",
                        }}
                        onClick={() => handleClick(user.userId)}
                      >
                        {user.userId}
                      </Typography>
                      <Typography sx={{ lineHeight: "1.5", fontSize: "1em" }}>
                        {user.name}
                      </Typography>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Typography>No users found.</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchPage;
