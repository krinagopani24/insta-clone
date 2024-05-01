import React, { useEffect, useState } from "react";
import { ImageListItem, ImageList, Box } from "@mui/material";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import PostModel from "../../Components/profile/Model/PostModel";

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

const ExploreDiscover = () => {
  const [open, setOpen] = useState(false);
  const [lodaing, setLodaing] = useState(false);
  const [postData, setPostData] = useState([]);
  const [postModelData, setPostModelData] = useState({});
  const handleModel = (item) => {
    setPostModelData(item);
    setOpen(true);
  };

  const handleModelClose = () => {
    setOpen(false);
    setPostModelData({});
  };

  useEffect(() => {
    setLodaing(true);
    const fetchData = async () => {
      const postRef = collection(db, "posts");
      const q = query(postRef, orderBy("timestamp", "desc"), limit(30));
      try {
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setPostData(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();

    setLodaing(false);
  }, []);
  return (
    <Box
      sx={{
        height: "100%",
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
      {lodaing ? (
        <h1>Loading...</h1>
      ) : (
        <ImageList variant="masonry" cols={3} gap={10}>
          {postData.map((item,i) => (
            <ImageListItem
              onClick={() => handleModel(item)}
              key={i}
              cols={item.cols || 1}
              rows={item.rows || 1}
            >
              {item?.type === "reel" ? (
                <video
                  className="h-1/2 w-full rounded-md object-fill object-center border border-black cursor-pointer"
                  src={item.postURL}
                />
              ) : (
                <img
                  className="rounded-md object-fill object-center border border-black cursor-pointer"
                  {...srcset(item.postURL, 300, item.rows, item.cols)}
                  alt={item.title}
                  loading="lazy"
                />
              )}
            </ImageListItem>
          ))}
        </ImageList>
      )}
      {open && (
        <PostModel
          type={postModelData?.type}
          open={open}
          handleModelClose={handleModelClose}
          post={postModelData}
        />
      )}
    </Box>
  );
};

export default ExploreDiscover;
