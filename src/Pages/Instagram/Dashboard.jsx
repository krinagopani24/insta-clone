import { Box } from "@mui/material";
import Story from "../../Components/DashBoard/Story";
import DashboardSideBar from "../../Components/DashBoard/DashboardSideBar";
import Post from "../../Components/DashBoard/Post";

const Dashboard = () => {
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    // event.target.scrollingElement;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      console.log("Bottom reached");
    }
  };
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        bgcolor: "aliceblue",
        display: "flex",
      }}
      onScroll={handleScroll}
    >
      <Box sx={{ height: "100%", width: "70%" }}>
        <Box sx={{ height: "20%", maxWidth: "100%" }}>
          <Story />
        </Box>
        <Box sx={{ height: "80%", width: "100%" }}>
          <Post />
        </Box>
      </Box>
      <Box sx={{ height: "100%", width: "30%", position: "sticky", top: 0 }}>
        <DashboardSideBar />
      </Box>
    </Box>
  );
};

export default Dashboard;
