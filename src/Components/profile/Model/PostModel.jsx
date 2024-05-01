import {
  Box,
  InputBase,
  Typography,
  Avatar,
  IconButton,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../../../hooks/AuthContext";
import { useContext, useEffect, useState } from "react";
import usePostComment from "../../../hooks/usePostComment";
import Comment from "../../DashBoard/Comment";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import useLikePost from "../../../hooks/usePostLike";
import usePostSave from "../../../hooks/usePostSave";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "65%",
  height: "90%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

export default function PostModel({
  open,
  type,
  page=null,
  post,
  handleModelClose,
  handleDeletePost = null,
}) {
  const { isSaved, handleSavePost } = usePostSave(post?.postId);
  const { handleLikePost, isLiked, likes } = useLikePost(post);
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({});

  const handleClose = async () => {
    handleModelClose();
  };

  const navigate = useNavigate();
  const { handlePostComment, commentNumber } = usePostComment(
    post?.comments?.length
  );
  const [comments, setComments] = useState(post.comments);

  const [anchorEl, setAnchorEl] = useState(null);
  const openAnchor = Boolean(anchorEl);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (post?.postId) {
      const fetch = async () => {
        const postRef = doc(db, "posts", post.postId);
        const postSnap = await getDoc(postRef);
        const commentsData = postSnap.data().comments;
        commentsData.reverse();
        setComments(commentsData);

        const postUserRef = doc(db, "users", postSnap.data().uid);
        const postUserSnap = await getDoc(postUserRef);
        const postUserData = postUserSnap.data();
        setUserData(postUserData);
      };
      fetch();
    }
  }, [commentNumber, post.postId]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate(`/Profile/${userData.userId}`);
    handleClose();
  };

  const [deleteLoading, setDeleteLoading] = useState(false);
  const handlePostDelete = async () => {
    try {
      setDeleteLoading(true);

      await handleDeletePost();
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
    }
    setAnchorEl(null);
    handleClose();
  };

  const handleSubmitComment = async () => {
    await handlePostComment(post.postId, comment);
    setComment("");
  };

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
          <Box
            sx={{
              width: "auto",
              alignSelf: "center",
              borderRadius: "4px",
            }}
          >
            {type === "post" ? (
              <img
                srcSet={`${post?.postURL}`}
                src={`${post?.postURL}`}
                alt={post?.caption}
                loading="lazy"
                className="rounded-lg relative max-w-[40vw] max-h-[90vh]"
              />
            ) : (
              <video
                className="max-w-[40vw] max-h-[90vh] rounded-md object-fill object-center"
                controls
                src={post.postURL}
              />
            )}
          </Box>
          <Box sx={{ width: "40%", backgroundColor: "#CCCCFF" }}>
            <Box
              sx={{
                width: "100%",
                height: "13%",
                border: "1px solid #B0BAC1",
                p: 0.5,
                bgcolor: "#C1DEF3",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "4px",
                pl: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  alt={userData?.name}
                  onClick={handleProfileClick}
                  src={userData?.picture}
                  sx={{ cursor: "pointer" }}
                />
                <Box sx={{ pl: 2 }}>
                  <Typography
                    onClick={handleProfileClick}
                    sx={{ cursor: "pointer" }}
                  >
                    {userData?.name}
                  </Typography>
                  <Typography>{post?.location}</Typography>
                </Box>
              </Box>
              {currentUser.uid === userData.uid && page=== 'post'? (
                <>
                  <IconButton
                    color="primary"
                    aria-label="add to shopping cart"
                    id="basic-button"
                    aria-controls={openAnchor ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openAnchor ? "true" : undefined}
                    onClick={handleClick}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openAnchor}
                    onClose={handleCloseAnchor}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={handlePostDelete}>
                      {deleteLoading ? (
                        <ListItemText>Loading</ListItemText>
                      ) : (
                        <>
                          <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>Delete Post</ListItemText>
                        </>
                      )}
                    </MenuItem>
                  </Menu>
                </>
              ) : null}
            </Box>
            <Box
              sx={{
                width: "100%",
                height: "62%",
                border: "1px solid #B0BAC1",
                overflowY: "auto",
                p: 0.5,
              }}
            >
              {comments?.map((comment, index) => (
                <Comment
                  key={index}
                  comment={comment}
                  handleClose={handleClose}
                />
              ))}
            </Box>
            <Box
              sx={{
                width: "100%",
                height: "17%",
                border: "1px solid #B0BAC1",
                p: 0.5,
              }}
            >
              <Box sx={{ width: "100%", display: "flex", alignItems: "start" }}>
                <Typography sx={{ fontSize: "1em", mr: 3 }}>
                  {likes || 0} likes
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <IconButton
                    onClick={handleLikePost}
                    sx={{ cursor: "pointer" }}
                  >
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
                </Box>
                <Box>
                  <IconButton
                    onClick={handleSavePost}
                    sx={{ cursor: "pointer" }}
                  >
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
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
