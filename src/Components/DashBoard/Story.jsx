import { Box, Avatar, Badge } from "@mui/material";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../hooks/AuthContext";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useState } from "react";
import StoryUploadModel from "../Model/StoryUploadModel";
import StoryViewModel from "../Model/StoryViewModel";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Story = () => {
  const [isStoryModel, setIsStoryModel] = useState({
    open: false,
    uid: "",
    name: "",
    picture: "",
    story: [],
  });
  const [storyUploadModel, setStoryUploadModel] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [storys, setStorys] = useState([]);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        if (currentUser?.following.length > 0) {
          const currentUserData = await getDoc(
            doc(db, "users", currentUser.uid)
          );
          const following = currentUserData.data().following;

          const story = [];
          following.map(async (user) => {
            const data = await getDoc(doc(db, "users", user));
            if (
              data?.data()?.story?.length > 0 &&
              data.data().story !== (undefined || null)
            ) {
              story.push({
                uid: data.data().uid,
                name: data.data().name,
                picture: data.data().picture,
                story: data.data().story,
              });
            }

            setStorys([...story]);
          });
        }
      } catch (error) {
        console.error("Error fetching following stories:", error);
        return;
      }
    };
    fetchStory();
  }, [currentUser]);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        bgcolor: "#E1E8E8",
        p: 1,
        gap: 1,
        display: "flex",
        overflow: "auto",
        borderRadius: 3,
      }}
      className="space-x-3"
    >
      <StoryUploadModel setOpen={setStoryUploadModel} open={storyUploadModel} />
      <StoryViewModel setStory={setIsStoryModel} story={isStoryModel} />
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <AddCircleIcon
            sx={{
              bgcolor: "black",
              color: "white",
              borderRadius: 4,
              ":hover": {
                bgcolor: "white",
                color: "#EAB4ED",
              },
            }}
            onClick={() => setStoryUploadModel(true)}
          />
        }
      >
        <Avatar
          alt={currentUser?.name}
          src={currentUser?.picture}
          sx={{ height: 50, width: 50 }}
          className="cursor-pointer"
          onClick={() =>
            currentUser?.story.length > 0 &&
            setIsStoryModel({
              open: true,
              uid: currentUser.uid,
              name: currentUser.name,
              picture: currentUser.picture,
              story: currentUser.story,
            })
          }
        />
      </Badge>

      {storys.length > 0 &&
        storys.map((story, i) => (
          <Avatar
            key={i}
            alt={story?.name}
            src={story?.picture}
            sx={{ height: 50, width: 50 }}
            className="cursor-pointer"
            onClick={() =>
              story?.story.length > 0 &&
              setIsStoryModel({
                open: true,
                uid: story.uid,
                name: story.name,
                picture: story.picture,
                story: story.story,
              })
            }
          />
        ))}
    </Box>
  );
};

export default Story;
