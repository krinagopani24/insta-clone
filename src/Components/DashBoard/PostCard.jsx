import {
  Box,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Modal,
  InputBase,
  Paper,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RateReviewIcon from "@mui/icons-material/RateReview";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { timeConverter } from "../../utils/timeConvet";
import useLikePost from "../../hooks/usePostLike";
import usePostComment from "../../hooks/usePostComment";
import Comment from "./Comment";
import usePostSave from "../../hooks/usePostSave";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const { handlePostComment, commentNumber } = usePostComment(
    post?.comments?.length
  );
  const { isSaved, handleSavePost } = usePostSave(post?.postId);
  const [userData, setUserData] = useState({});
  const { handleLikePost, isLiked, likes } = useLikePost(post);
  const [commentModel, setCommentModel] = useState(false);
  const [comment, setComment] = useState("");
  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, "users", post.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    fetchUserData();
  }, [post.uid]);

  const handleCommentModel = () => {
    setCommentModel(true);
  };

  const handleSubmitComment = async () => {
    await handlePostComment(post.postId, comment);
    setComment("");
  };

  const handleProfileClick = () => {
    navigate(`/profile/${userData.userId}`);
  };

  return (
    <Box
      sx={{
        width: "60%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F7FAFA",
        borderRadius: 3,
        boxShadow: "0px 0px 8px black",
        ":hover": {
          boxShadow: "0px 0px 11px black",
        },
        marginBottom: "20px",
        p: 1,
        position: "relative",
        zIndex: "2",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        boxSizing: "border-box",
        border: "1px solid #e0e0e0",
        color: "black",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          height: "20%",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar
          alt={userData.name}
          src={userData.picture}
          sx={{ height: "56px", width: "56px", cursor: "pointer" }}
          onClick={handleProfileClick}
        />
        <Box sx={{ alignItems: "center", pl: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {" "}
            <Typography
              sx={{ fontSize: "1.5em", mr: 3, cursor: "pointer" }}
              onClick={handleProfileClick}
            >
              {userData.userId}
            </Typography>
            <Typography>{timeConverter(post.timestamp)}</Typography>
          </Box>
          <Typography>{post.location}</Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1, border: "1px solid #D1C9C8", borderRadius: 4, my: 2 }}>
        {post.type === "post" ? (
          <img src={post.postURL} alt="" className="rounded-xl" />
        ) : (
          <video
            className="max-h-[70vh] max-w-[35vw] rounded-md object-fill object-center"
            controls
            src={post.postURL}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </Box>
      <Box sx={{ alignItems: "baseline", width: "100%" }}>
        <Typography
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
          }}
        >
          {post.caption}
        </Typography>
        <Divider />
      </Box>
      <Box sx={{ width: "100%", display: "flex", alignItems: "start" }}>
        <Typography sx={{ fontSize: "1em", mr: 3 }}>
          {likes || 0} likes
        </Typography>
        <Typography
          sx={{ fontSize: "1em", mr: 3, cursor: "pointer" }}
          onClick={commentNumber > 0 ? handleCommentModel : null}
        >
          {commentNumber || 0} Comments
        </Typography>
      </Box>
      <Box
        sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}
      >
        <Box>
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
        </Box>
        <Box>
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
      </Box>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Comment...."
          inputProps={{ "aria-label": "search google maps" }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        {comment.length > 0 && (
          <Typography
            sx={{
              p: "10px",
              color: "blueviolet",
              cursor: "pointer",
              ":hover": {
                color: "blue",
              },
            }}
            onClick={handleSubmitComment}
          >
            Post
          </Typography>
        )}
      </Paper>
      {commentModel && (
        <CommentModel
          open={commentModel}
          setOpen={setCommentModel}
          post={post}
        />
      )}
    </Box>
  );
};

export default PostCard;

export const CommentModel = ({ open, setOpen, post }) => {
  const style = {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "25%",
    maxHeight: "50%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
  };
  const [comments, setComments] = useState([]);
  useEffect(() => {
    const fetchComments = async () => {
      const commentRef = doc(db, "posts", post.postId);
      const commentDoc = await getDoc(commentRef);
      const comment = await commentDoc.data().comments;
      setComments(comment);
    };

    return () => {
      fetchComments();
    };
  }, [post?.comments, post.postId]);

  const handleClose = () => setOpen(false);
  return (
    <Box>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style} className="flex justify-between">
          <Box sx={{ height: "100%", width: "100%", overflowY: "auto" }}>
            {comments?.length !== 0 &&
              comments?.map((comment, index) => (
                <Comment key={index} comment={comment} />
              ))}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
