import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import Stories from "react-insta-stories";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const StoryViewModel = ({ story, setStory }) => {
  const [storyArray, setStoryArray] = useState([]);
  useEffect(() => {
    setStoryArray([]);
    const fetchStory = async () => {
      story.story.map(async (storyId) => {
        const data = await getDoc(doc(db, "story", storyId));
        if (data.exists()) {
          setStoryArray((prev) => [
            ...prev,
            {
              url: data.data().storyURL,
              type: data.data().type,
              duration: 3000,
              header: {
                heading: story.name,
                profileImage: story.picture,
              },
            },
          ]);
        }
      });
    };
    fetchStory();
  }, [story.name, story.picture, story.story, story.type]);

  const handleClose = () =>
    setStory({ open: false, uid: "", name: "", picture: "", story: [] });
  return (
    <Modal
      open={story.open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          sx={{
            height: "100%",

            borderRadius: 4,
          }}
        >
          <Box>
            {storyArray.length > 0 && (
              <Stories stories={storyArray} defaultInterval={1500} />
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default StoryViewModel;
