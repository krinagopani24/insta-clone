import { useContext, useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { SnackBarContext } from "../App";
import { AuthContext } from "./AuthContext";
import { db } from "../firebase";

const usePostSave = (postId) => {
  const [isSave, setIsSave] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { setSnackBar } = useContext(SnackBarContext);
  const [isSaved, setIsSaved] = useState(
    currentUser?.saved?.includes(postId)
  );

  const handleSavePost = async () => {
    if (isSave) return;
    setIsSave(true);

    try {
      const userRef = doc(db, "users", currentUser?.uid);

      await updateDoc(userRef, {
        saved: isSaved
          ? arrayRemove(postId)
          : arrayUnion(postId),
      });

      setIsSaved(!isSaved);
    } catch (error) {
      console.log(error);
      setSnackBar({
        open: true,
        message: error.message,
        type: "error",
      });
    } finally {
      setIsSave(false);
    }
  };

  return { isSaved, handleSavePost };
};

export default usePostSave;
