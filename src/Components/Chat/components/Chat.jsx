import React, { useContext } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { Avatar, Box, Typography } from "@mui/material";
import { ChatContext } from "../../../hooks/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className="chat">
      {data?.chatId !== "null" ? (
        <>
          <div className="chatInfo">
            <div className="flex space-x-3 items-center">
              <Avatar src={data.user?.picture} />
              <span>{data.user?.name}</span>
            </div>
            <div className="chatIcons">
              <img src={Cam} alt="" />
              <img src={Add} alt="" />
              <img src={More} alt="" />
            </div>
          </div>
          <Messages />
          <Input />
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ color: "gray", fontSize: "20px", fontWeight: "500" }}
          >
            Select any user from side bar... to start chat.
          </Typography>
          <Typography
            sx={{ color: "gray", fontSize: "20px", fontWeight: "400" }}
          >
            OR
          </Typography>
          <Typography
            sx={{ color: "gray", fontSize: "20px", fontWeight: "500" }}
          >
            Search user by userName..
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default Chat;
