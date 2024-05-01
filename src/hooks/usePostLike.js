import { useContext, useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

import { SnackBarContext } from "../App";
import { AuthContext } from "./AuthContext";
import { db } from "../firebase";

const useLikePost = (post) => {
  const [isLiking, setIsLiking] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { setSnackBar } = useContext(SnackBarContext);
  const [likes, setLikes] = useState(post?.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(post?.likes?.includes(currentUser?.uid));

  const handleLikePost = async () => {
    if (isLiking) return;
    if (!currentUser)
      return setSnackBar({
        open: true,
        message: "You must be logged in to like a post",
        type: "error",
      });
    setIsLiking(true);

    try {
      const postRef = doc(db, "posts", post?.postId);

      await updateDoc(postRef, {
        likes: isLiked
          ? arrayRemove(currentUser.uid)
          : arrayUnion(currentUser.uid),
      });

      setIsLiked(!isLiked);
      isLiked ? setLikes(likes - 1) : setLikes(likes + 1);
    } catch (error) {
      console.log(error);
      setSnackBar({
        open: true,
        message: error.message,
        type: "error",
      });
    } finally {
      setIsLiking(false);
    }
  };

  return { isLiked, likes, handleLikePost, isLiking };
};

export default useLikePost;
