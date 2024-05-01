import { useContext, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { SnackBarContext } from "../App";
import { db } from "../firebase";

const useSearchUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setSnackBar } = useContext(SnackBarContext);
  const [user, setUser] = useState([]);

  const getUserProfile = async (username) => {
    setIsLoading(true);
    setUser(null);
    try {
      const searchQuery = query(
        collection(db, "users"),
        where("name", ">=", username),
        where("name", "<=", username + "\uf8ff"),
      );

      const querySnapshot = await getDocs(searchQuery);

      if (querySnapshot.empty) {
        setSnackBar({
          open: true,
          message: "No, User found!",
          type: "info",
        });
        return;
      }
      const users = [];
      querySnapshot.forEach((doc) => {
				console.log(doc.data());
        users.push(doc.data());
      });
      setUser(users);
    } catch (error) {
      console.log(error);
      setSnackBar({
        open: true,
        message: error.error,
        type: "info",
      });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getUserProfile, user, setUser };
};

export default useSearchUser;
