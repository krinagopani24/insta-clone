import { getDocs, limit, orderBy, query } from "firebase/firestore";
import { Box } from "@mui/material";
import PostCard from "./PostCard";
import { useContext, useEffect, useState } from "react";
import { collection } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../hooks/AuthContext";

const Post = () => {
  const [lodaing, setLodaing] = useState(false);
  const [postData, setPostData] = useState([]);
  const {currentUser} = useContext(AuthContext)
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
        postData.length > 0 &&
        postData.map((post, i) => <PostCard post={post} key={i} currentUserUid={currentUser.uid} />)
      )}
    </Box>
  );
};

export default Post;
