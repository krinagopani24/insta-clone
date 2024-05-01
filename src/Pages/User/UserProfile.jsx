import React, { useContext, useEffect } from "react";
import { Avatar, Typography, Box, Tab } from "@mui/material";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthContext } from "../../hooks/AuthContext";
import FollowAndFollowingShowModel from "../../Components/profile/Model/FollowAndFollowingShowModel";
import { UserProfileContext } from "../../hooks/UserProfileContext";
import { following, unfollowing } from "../../lib/firebase";
import Posts from "../../Components/profile/Posts";

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const { userData, setUserData } = useContext(UserProfileContext);
  const [isModelOpen, setIsModelOpen] = useState({ type: null, open: false });
  const [totalCounts, setTotalCounts] = useState(0);
  const [tab, setTab] = useState("1");
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    setTotalCounts(
      (userData?.post?.length || 0) + (userData?.reel?.length || 0)
    );
  }, [userData.post, userData.reel]);

  // handle tabBar sticky color
  const [isSticky, setIsSticky] = useState(false);
  const [stickyTop, setStickyTop] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsSticky(scrollTop >= stickyTop);
    };

    window.addEventListener("scroll", handleScroll); // Add scroll event listener

    return () => window.removeEventListener("scroll", handleScroll); // Remove listener on cleanup
  }, [stickyTop]);

  const handleStickyTop = () => {
    const tabListElement = document.querySelector(".sticky-container");
    if (tabListElement) {
      setStickyTop(tabListElement.offsetTop); // Get offsetTop for dynamic positioning
    }
  };
  useEffect(() => {
    handleStickyTop(); // Calculate stickyTop on component mount
  }, []);

  const [isFollow, setIsFollow] = useState(null);
  useEffect(() => {
    const handleData = () => {
      if (userData?.followers?.includes(currentUser.uid)) {
        setIsFollow(true);
      } else {
        setIsFollow(false);
      }
    };
    return () => {
      handleData();
    };
  }, [currentUser.uid, userData.followers]);

  const handleFollowUnFollow = async () => {
    const self = currentUser?.uid;
    const other = userData?.uid;
    if (userData?.followers?.includes(currentUser.uid)) {
      await unfollowing(self, other);
      setUserData((prevData) => ({
        ...prevData,
        followers: prevData?.followers.filter((id) => id !== self),
      }));
      setIsFollow(false);
    } else {
      await following(self, other);
      setUserData((prevData) => ({
        ...prevData,
        followers: [...prevData.followers, self],
      }));
      setIsFollow(true);
    }
  };

  const handleModel = (type) => {
    setIsModelOpen({ open: true, type: type });
  };

  return (
    <>
      {isModelOpen.open && (
        <FollowAndFollowingShowModel
          open={isModelOpen.open}
          handleClose={() => setIsModelOpen({ open: false, type: null })}
          data={
            isModelOpen.type === "following"
              ? userData.following
              : userData.followers
          }
          type={isModelOpen.type}
        />
      )}
      <Box className="w-full h-full rounded-xl">
        <Box
          height={"35%"}
          width={"100%"}
          className=" p-5 flex  items-center justify-evenly px-[20%]"
        >
          <Box>
            <Avatar
              src={userData.picture}
              style={{ width: "144px", height: "144px" }}
            />
          </Box>
          <Box className="space-y-3">
            <Box className="flex justify-center space-x-4">
              <Typography variant="h6" className="cursor-pointer">
                {userData?.userId || "Test"}
              </Typography>
              {userData?.userId === currentUser?.userId ? (
                <>
                  <Button
                    variant="contained"
                    className="rounded-full bg-blue-gray-500 text-white normal-case text-sm"
                    onClick={() => navigate("/editProfile")}
                  >
                    Edit profile
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color={isFollow ? "success" : "error"}
                    variant="contained"
                    className=" bg-gray-600 normal-case text-white text-sm"
                    onClick={handleFollowUnFollow}
                  >
                    {isFollow ? "Follow" : "unfollow"}
                  </Button>
                </>
              )}
            </Box>
            <Box className="flex space-x-7">
              <Typography variant="body2">
                {totalCounts > 0 ? totalCounts : "0"} posts
              </Typography>
              <Typography
                variant="body2"
                className="cursor-pointer"
                onClick={() => handleModel("follow")}
              >
                {userData.followers && userData?.followers?.length > 0
                  ? userData?.followers?.length
                  : 0}{" "}
                followers
              </Typography>
              <Typography
                variant="body2"
                className="cursor-pointer"
                onClick={() => handleModel("following")}
              >
                {userData.following && userData?.following?.length > 0
                  ? userData?.following?.length
                  : "0"}{" "}
                following
              </Typography>
            </Box>
            <Typography variant="subtitle1">{userData?.name}</Typography>
            <Typography variant="body1" sx={{maxWidth:'23vw'}}>{userData.bio || "ddasd "}</Typography>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            height: "65%",
            width: "100%",
          }}
          className="px-2 "
        >
          <TabContext value={tab} className="items-center text-center">
            <Box
              className="sticky-container"
              sx={{
                zIndex: 10,
                position: "sticky",
                top: 0,
                backgroundColor: isSticky ? "black" : "inherit",
              }}
            >
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  width: "100%",
                  display: "flex",
                  alignItems: "center", // Centers content vertically
                  justifyContent: "center",
                }}
              >
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    label="POSTS"
                    value={"1"}
                    sx={{ color: isSticky ? "white" : "black" }}
                  />
                  <Tab
                    label="REELS"
                    value={"2"}
                    sx={{ color: isSticky ? "white" : "black" }}
                  />
                  {userData?.uid === currentUser?.uid && (
                    <Tab
                      label="SAVED"
                      value={"3"}
                      sx={{ color: isSticky ? "white" : "black" }}
                    />
                  )}
                </TabList>
              </Box>
            </Box>
            <Box
              sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TabPanel value={"1"}>
                <Posts userData={userData} type="post" setUserData={setUserData}/>
              </TabPanel>
              <TabPanel value={"2"}>
                <Posts userData={userData} type="reel" setUserData={setUserData}/>
              </TabPanel>
              {userData?.uid === currentUser?.uid && (
                <TabPanel value={"3"}>
                  <Posts userData={userData} type="saved" setUserData={setUserData}/>
                </TabPanel>
              )}
            </Box>
          </TabContext>
        </Box>
      </Box>
    </>
  );
};

export default UserProfile;
