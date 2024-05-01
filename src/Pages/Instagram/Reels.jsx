import { useEffect, useState } from "react";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RateReviewIcon from "@mui/icons-material/RateReview";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useNavigate } from "react-router-dom";
import { fetchReels } from "../../lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import useLikePost from "../../hooks/usePostLike";
import usePostComment from "../../hooks/usePostComment";
import usePostSave from "../../hooks/usePostSave";
import { CommentModel } from "../../Components/DashBoard/PostCard";

const Reels = () => {
  const [reelsData, setReelsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchReels();
      setReelsData(data);
    };
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "scroll",
        width: "98%",
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
        overflow: "auto",
        transition: "all 0.3s ease-in-out",
        boxSizing: "border-box",
        border: "1px solid #e0e0e0",
        color: "black",
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "24px",
        alignItems: "center",
      }}
    >
      {reelsData && reelsData.map((reel) => <Reel key={reel.id} reel={reel} />)}
    </Box>
  );
};

export default Reels;

const Reel = ({ reel }) => {
  console.log(reel);
  const [commentModel, setCommentModel] = useState(false);
  const { handleLikePost, isLiked, likes } = useLikePost(reel);
  const { commentNumber } = usePostComment(reel?.comments?.length);
  const { isSaved, handleSavePost } = usePostSave(reel?.postId);
  const handleCommentModel = () => {
    setCommentModel(true);
  };
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setUserData([]);
      try {
        const userCollectionRef = collection(db, "users");
        const userDocRef = doc(userCollectionRef, reel.uid);
        const userDocSnap = await getDoc(userDocRef);
        const data = userDocSnap.exists()
          ? {
              picture: userDocSnap.data().picture,
              userId: userDocSnap.data().userId,
              name: userDocSnap.data().name,
            }
          : null;
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [reel.uid]);
  const navigate = useNavigate();
  const handleUser = () => {
    navigate(`/Profile/${reel.userId}`);
  };

  return (
    <Box sx={{ width: "30%", position: "relative", height: "90%" }}>
      <video className="max-h-[90vh] w-full" controls>
        <source src={reel.postURL} type="video/mp4" />
      </video>
      <Box
        sx={{
          position: "absolute",
          top: 10,
          left: 10,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar
          src={userData.picture}
          sx={{ mr: 1, cursor: "pointer" }}
          onClick={handleUser}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            variant="body2"
            sx={{ cursor: "pointer" }}
            onClick={handleUser}
          >
            {userData.userId}
          </Typography>
          <Typography variant="body2">{userData.name}</Typography>
        </Box>
      </Box>{" "}
      <Box
        sx={{
          zIndex: 2,
          position: "absolute",
          right: -50,
          bottom: 50,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <IconButton onClick={handleLikePost} sx={{ cursor: "pointer" }}>
          {!isLiked ? (
            <FavoriteBorderIcon
              sx={{
                fontSize: "2rem",
                lineHeight: "2.5rem",
              }}
            />
          ) : (
            <FavoriteIcon
              sx={{
                fontSize: "2rem",
                lineHeight: "2.5rem",
                color: "red",
              }}
            />
          )}
        </IconButton>
        <Typography variant="body2">{likes}</Typography>

        <RateReviewIcon
          onClick={commentNumber > 0 ? handleCommentModel : null}
          sx={{
            fontSize: "2rem",
            lineHeight: "2.5rem",
            cursor: "pointer",
            ":hover": {
              color: "#D1C9C8",
            },
          }}
        />
        <Typography variant="body2">{commentNumber}</Typography>
        <IconButton onClick={handleSavePost} sx={{ cursor: "pointer" }}>
          {isSaved ? (
            <BookmarkIcon
              sx={{
                fontSize: "2rem",
                lineHeight: "2.5rem",
                cursor: "pointer",
                ":hover": {
                  color: "#D1C9C8",
                },
              }}
            />
          ) : (
            <BookmarkBorderIcon
              sx={{
                fontSize: "2rem",
                lineHeight: "2.5rem",
                cursor: "pointer",
                ":hover": {
                  color: "#D1C9C8",
                },
              }}
            />
          )}
        </IconButton>
      </Box>
      {commentModel && (
        <CommentModel
          open={commentModel}
          setOpen={setCommentModel}
          post={reel}
        />
      )}
    </Box>
  );
};
