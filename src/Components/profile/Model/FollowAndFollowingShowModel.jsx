import { Box, Avatar, Divider } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../../../lib/firebase";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  borderRadius: 5,
  p: 2,
};

const FollowAndFollowingShowModel = ({ open, handleClose, data, type }) => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const users = await fetchUsers(data);
      setUserList(users);
    }
    fetchData();
  }, [data]);

  const handleClick = (user) => {
    navigate(`/Profile/${user}`);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => handleClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          sx={{ mb: 1 }}
        >
          {type === "follow" ? "Followers" : "Following"}
        </Typography>
        <Divider variant="middle" flexItem />
        <Box sx={{ maxHeight: "400px", overflow: "auto", mt: 2 }}>
          {userList &&
            userList.map((user, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "#D1E1E1",
                    p: 1,
                    m: 1,
                    borderRadius: 5,
                    ":hover": {
                      bgcolor: "#C7E1E1",
                    },
                  }}
                  className="space-x-4"
                >
                  <Avatar
                    alt="Remy Sharp"
                    src={user.picture}
                    sx={{ width: 56, height: 56, cursor: "pointer" }}
                    onClick={() => handleClick(user.userId)}
                  />
                  <Divider
                    variant="fullWidth"
                    flexItem
                    orientation="vertical"
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: 54,
                    }}
                  >
                    <Typography
                      sx={{
                        lineHeight: "1",
                        fontSize: "1.2em",
                        cursor: "pointer",
                      }}
                      onClick={() => handleClick(user.userId)}
                    >
                      {user.userId}
                    </Typography>
                    <Typography sx={{ lineHeight: "1.5", fontSize: "1em" }}>
                      {user.name}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
        </Box>
      </Box>
    </Modal>
  );
};

export default FollowAndFollowingShowModel;
