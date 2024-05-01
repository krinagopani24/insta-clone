import React, { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUserDoc } from "../lib/firebase";
import UserProfile from "../Pages/User/UserProfile";

const UserProfileContext = createContext();

const UserProfileProvider = () => {
  const [userData, setUserData] = useState({
    userId: null,
    post: null,
    reel: null,
    following: null,
    followers: null,
    picture: null,
    bio: null,
    uid: null,
    name: null,
  });
  const { userid } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await fetchUserDoc(userid);
        setUserData((pre) => ({ ...pre, ...fetchedData }));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userid]);

  return (
    <UserProfileContext.Provider value={{ userData,setUserData }}>
      <UserProfile />
    </UserProfileContext.Provider>
  );
};

export { UserProfileProvider, UserProfileContext };
