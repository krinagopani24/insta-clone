import React, { useCallback, useContext, useRef, useState } from "react";
import { AuthContext } from "../../../hooks/AuthContext";
import { ChatContext } from "../../../hooks/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../firebase";

import { Box, Paper, InputBase, Divider, IconButton } from "@mui/material";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import AttachmentIcon from "@mui/icons-material/Attachment";
import TelegramIcon from "@mui/icons-material/Telegram";
import imageCompression from "browser-image-compression";

import EmojiPicker from "emoji-picker-react";
import { SnackBarContext } from "../../../App";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const fileInputRef = useRef(null);
  const { setSnackBar } = useContext(SnackBarContext);
  const handleFileChange = useCallback(
    async (event) => {
      const selectedFile = event.target.files[0];
      if (!selectedFile) return; // Handle no file selected

      // Validate file type (optional)
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/jfif",
        "image/pjpeg",
        "image/pjp",
        "image/heif",
        "image/heic",
      ];
      if (!selectedFile.type || !allowedTypes.includes(selectedFile.type)) {
        setSnackBar({
          open: true,
          message:
            "Only PNG, JPG, JPEG, JFIF, PJPEG, PJP, HEIF, HEIC are allowed...",
          style: "info",
        });
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setSnackBar({
          open: true,
          message: "File size is too large.,10MB allowed",
          style: "error",
        });
        return;
      }
      if (selectedFile.type.includes("image")) {
        const compressedImage = await imageCompress(selectedFile);
        setImg(compressedImage);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const imageCompress = (imageFile) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);

        reader.onload = async (event) => {
          const img = new Image();
          img.src = event.target.result;

          img.onload = async () => {
            const maxHeight = 1024; // Target maximum height
            const maxWidth = Math.round((img.width * maxHeight) / img.height); // Aspect ratio-preserving width

            const options = {
              maxSize: 2 * 1024 * 1024, // Set maximum compressed file size (adjust as needed)
              mimeType: imageFile.type, // Preserve original MIME type
              maxWidth,
              maxHeight,
            };
            try {
              const compressedFile = await imageCompression(imageFile, options);
              resolve(compressedFile);
            } catch (compressionError) {
              reject(compressionError);
            }
          };
          img.onerror = (error) => {
            reject(error);
          };
        };
        reader.onerror = (error) => {
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  };

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, `chat/${uuid()}`);

      const uploadTask = uploadBytes(storageRef, img);
      await uploadTask;
      const imageUrl = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          img: imageUrl,
        }),
      });
    } else {
      if (text !== "") {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      }
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  const handleKeyDown = (event) => {
    if (event.nativeEvent.key === "Enter" && text.trim() !== "") {
      event.preventDefault(); // Prevent form submission
      handleSend(text); // Pass the entered text to handleSend function
      setText(""); // Clear the input field after sending
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    // event.stopPropagation();
    // alert(event.target.value);
    setText(event.target.value);
  };
  const [emojiKeyboardToggle, setEmojiKeyboardToggle] = useState(false);
  return (
    <Box
      sx={{ width: "100%", height: "8%" }}
      className="flex items-center justify-center"
    >
      <Paper
        component="form"
        sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}
        className="w-full"
      >
        <IconButton
          sx={{ p: "10px" }}
          aria-label="Emoji"
          onClick={() => {
            setEmojiKeyboardToggle(!emojiKeyboardToggle);
          }}
        >
          <SentimentSatisfiedAltIcon className="text-black" />
        </IconButton>

        <EmojiPicker
          open={emojiKeyboardToggle}
          theme="auto"
          onEmojiClick={(emoji) => {
            // console.log(emoji.emoji);
            setText(text + emoji.emoji);
          }}
          onOpen={() => setEmojiKeyboardToggle(true)} // Open manually if needed
          onClose={() => setEmojiKeyboardToggle(false)}
          style={{
            position: "absolute",
            top: "20%",
            left: "30%",
          }}
          height={"60%"}
          width={"20%"}
        />

        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Send Message..."
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          inputProps={{ "aria-label": "Send Message..." }}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".png, .jpg, .jpeg, .jfif, .pjpeg, .pjp, .heif, .heic"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <IconButton
          type="button"
          onClick={() => fileInputRef.current.click()}
          sx={{
            p: "10px",
            transform: "rotate(-45deg)",
            "&:hover": {
              transform: "rotate(120deg)",
              color: "blueviolet",
            },
          }}
          aria-label="Attechment"
        >
          <AttachmentIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton
          type="button"
          sx={{
            p: "10px",
            "&:hover": { color: "blueviolet" },
          }}
          aria-label="Send"
          onClick={handleSend}
        >
          <TelegramIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default Input;
