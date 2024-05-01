import { Box, ImageList, ImageListItem } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { fetchPosts } from "../../lib/firebase";
import PostModel from "./Model/PostModel";
import { db, storage } from "../../firebase";
import { arrayRemove, collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { SnackBarContext } from "../../App";

const Posts = ({ userData, type, setUserData }) => {
  const { setSnackBar } = useContext(SnackBarContext);
  const [postData, setPostData] = useState([]);
  const [open, setOpen] = useState(false);
  const [postModelData, setPostModelData] = useState({});
  useEffect(() => {
    async function fetch() {
      const post =
        type === "post"
          ? userData?.post
          : type === "reel"
          ? userData?.reel
          : userData?.saved;
      const data = await fetchPosts(post);
      data?.reverse();
      setPostData(data);
    }
    userData?.post?.length > 0 ||
    userData?.reel?.length > 0 ||
    userData?.saved?.length > 0
      ? fetch()
      : setPostData([]);
  }, [userData, type]);

  const handleModel = (item) => {
    setPostModelData(item);
    setOpen(true);
  };

  const handleModelClose = () => {
    setOpen(false);
    setPostModelData({});
  };

  const handleDeletePost = async()=>{
    try {
      const postRef = doc(collection(db, "posts"), postModelData?.postId);
      await deleteDoc(postRef);

      const storageRef = ref(storage, `post/${postModelData.postId}`);
      await deleteObject(storageRef);

      const docRef = doc(db, "users", postModelData.uid);
      const t = type === "reel" ? "reel" : "post";
      await updateDoc(docRef, {
        [t]: arrayRemove(postModelData.postId),
      });
      setUserData({ ...userData, [type]: userData[type].filter((i) => i !== postModelData.postId) });
      setSnackBar({
        message: "Deleted Succesfully...",
        open: true,
        style: "success",
      });
    } catch (error) {
      console.log(error);
    } 
  }

  if (type === "post" && postData?.length === 0) {
    return (
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>No posts yet</p>
      </Box>
    );
  } else if (type === "reel" && postData?.length === 0) {
    return (
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>No reels yet</p>
      </Box>
    );
  } else if (type === "saved" && postData?.length === 0) {
    return (
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>No saved posts yet</p>
      </Box>
    );
  } else
    return (
      <Box sx={{ Height: "100%", width: "100%" }}>
        <ImageList
          sx={{
            width: "100%",
            height: "100%",
            overflow: "visible",
            paddingX: 3,
          }}
          cols={3}
        >
          {postData?.map((item, key) => (
            <ImageListItem
              key={key}
              onClick={() => handleModel(item)}
              className={`cursor-pointer p-1 m-2 shadow-md hover:shadow-lg border-2 rounded-lg`}
            >
              {item?.type === "post" ? (
                <img
                  srcSet={`${item.postURL}?w=164&h=164&c_fit=auto&c_gravity=face&auto=format&dpr=2 2x`}
                  src={`${item.postURL}?w=164&h=164&c_fit=auto&c_gravity=face&auto=format`}
                  alt={item.caption}
                  loading="lazy"
                  className="rounded-lg relative"
                />
              ) : (
                <video
                  className="max-h-[60vh] max-w-[40vw] w-[auto] h-[auto] rounded-md object-fill object-center"
                  src={item.postURL}
                />
              )}
            </ImageListItem>
          ))}
        </ImageList>
        {open && (
          <PostModel
            type={postModelData?.type}
            open={open}
            handleModelClose={handleModelClose}
            post={postModelData}
            page='post'
            handleDeletePost={handleDeletePost}
          />
        )}
      </Box>
    );
};

export default Posts;
