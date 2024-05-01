import { Box, Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useGetUserProfileById from "../../hooks/getUserByUserid";
import { timeConverter1 } from "../../utils/timeConvet";

const Comment = ({ comment, handleClose = () => {} }) => {
  const navigate = useNavigate();
  const handleProfile = (userId) => {
    navigate(`/Profile/${userId}`);
    handleClose();
  };
  const { userProfile, isFetching } = useGetUserProfileById(comment.createdBy);

  if (isFetching) {
    return <Box>Lodaing</Box>;
  }
  return (
    <Box sx={{ p: 1, display: "flex" }}>
      <Avatar
        src={userProfile.picture}
        onClick={() => handleProfile(userProfile.userId)}
      />
      <Box sx={{ pl: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex" }}>
          <Typography
            sx={{ pl: 1, textAlign: "center", cursor: "pointer" }}
            onClick={() => handleProfile(userProfile.userId)}
          >
            {userProfile.name}
          </Typography>
          <Typography sx={{ pl: 1, textAlign: "center", color: "#605D5C" }}>
            {timeConverter1(comment.createdAt)}
          </Typography>
        </Box>
        <Typography sx={{ pl: 1 }}>{comment.comment}</Typography>
      </Box>
    </Box>
  );
};

export default Comment;
