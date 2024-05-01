import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const fetchUserDoc = async (userId) => {
  try {
    const userRef = query(
      collection(db, "users"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(userRef);

    if (querySnapshot.empty) {
      console.log("No matching document found");
      return null; // Handle cases where the document is not found
    }
    return querySnapshot.docs[0].data(); // Return data from the first document
  } catch (error) {
    console.error("Error fetching user document:", error);
    return null; // Return null in case of errors
  } // Return null in case of errors or non-existent document
};

const handleGoogleAuth = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const userRef = doc(db, "users", result.user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Create the user document only if it doesn't exist
      await setDoc(userRef, {
        picture: result.user.photoURL,
        name: result.user.displayName,
        userId: null,
        post: null,
        reel: null,
        following: null,
        followers: null,
        bio: null,
        saved: null,
        dateOfBirth: null,
        gender: null,
        uid: result.user.uid,
        story: [],
      });
      await setDoc(doc(db, "userChats", result.user.uid), {});
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);
  }
};

const handlePost = async (data) => {
  try {
    const data1 = {
      uid: data.uid,
      userId: data.userId,
      caption: data.caption,
      location: data.location,
      likes: [],
      comments: [],
      type: data.type,
      timestamp: serverTimestamp(),
    };
    const postRef = await addDoc(collection(db, "posts"), {
      ...data1,
    });
    // 2. (Optional) Handle potential upload errors
    const storageRef = ref(storage, `post/${postRef.id}`);
    const uploadTask = uploadBytes(storageRef, data.picture);
    await uploadTask;

    // 4. Get the download URL for the uploaded image
    const imageUrl = await getDownloadURL(storageRef);

    // 5. Update the post document with the image URL
    await setDoc(postRef, { ...data1, postURL: imageUrl, postId: postRef.id });
    const docRef = doc(db, "users", data1.uid);

    const postReel =
      data.type === "post"
        ? {
            post: arrayUnion(postRef.id),
          }
        : {
            reel: arrayUnion(postRef.id),
          };
    console.log();
    await updateDoc(docRef, postReel);

    return {
      open: true,
      message: "Post Uploaded succesfully...",
      style: "success",
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return { open: true, message: "Error creating post...", style: "error" };
  }
};

const fetchPosts = async (post) => {
  const postsCollectionRef = collection(db, "posts");
  try {
    const postsData =await Promise.all(
      post.map(async (postId) => {
        const postDocRef = doc(postsCollectionRef, postId);
        const postDocSnap = await getDoc(postDocRef);
        return postDocSnap.exists() ? postDocSnap.data() : null;
      })
    );
    return postsData.filter((post) => post !== null);
  } catch (error) {
    console.log(error);
  }
};

const uploadStory = async (data) => {
  try {
    const data1 = {
      uid: data.uid,
      type: data.type,
    };
    const postRef = await addDoc(collection(db, "story"), {
      ...data1,
    });
    const storageRef = ref(storage, `story/${postRef.id}`);
    const uploadTask = uploadBytes(storageRef, data.file);
    await uploadTask;

    // 4. Get the download URL for the uploaded image
    const imageUrl = await getDownloadURL(storageRef);

    // 5. Update the post document with the image URL
    await setDoc(postRef, { ...data1, storyURL: imageUrl });
    const docRef = doc(db, "users", data.uid);

    await updateDoc(docRef, { story: arrayUnion(postRef.id) });

    return {
      open: true,
      message: "Story Posted succesfully...",
      style: "success",
    };
  } catch (error) {
    console.error("Error creating post:", error);
    return { open: true, message: "Error Uploading Story...", style: "error" };
  }
};

const following = async (self, other) => {
  try {
    console.log(self, other);
    const docRef = doc(db, "users", self);
    await updateDoc(docRef, {
      following: arrayUnion(other),
    });

    const docRef1 = doc(db, "users", other);
    await updateDoc(docRef1, {
      followers: arrayUnion(self),
    });
  } catch (error) {
    console.log(error);
  }
};

const unfollowing = async (self, other) => {
  try {
    const docRef = doc(db, "users", self);
    await updateDoc(docRef, {
      following: arrayRemove(other),
    });

    const docRef1 = doc(db, "users", other);
    await updateDoc(docRef1, {
      followers: arrayRemove(self),
    });
  } catch (error) {
    console.log(error);
  }
};

const Logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    return false;
  }
};

const suggestionList = async (following) => {
  const userRef = collection(db, "users");
  try {
    const querySnapshot = await getDocs(userRef);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push(doc.id);
    });
    const followingSet = new Set(following);
    const documentsSet = new Set(documents);
    const difference = documentsSet.difference(followingSet);
    const diffArray = Array.from(difference).slice(0, 30);

    const usersData = [];
    for (const userId of diffArray) {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        usersData.push({
          uid: userDoc.data().uid,
          userId: userDoc.data().userId,
          bio: userDoc.data().bio,
          picture: userDoc.data().picture,
        });
      } else {
        console.log(`No data found for user ID: ${userId}`);
      }
    }

    return usersData;
  } catch (error) {
    console.error("Error fetching random users:", error);
    return []; // Handle errors gracefully (optional)
  }
};

const updateProfilePicture = async (uid, file) => {
  try {
    const storageRef = ref(storage, `profilePhoto/${uid}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const handleUpdateProfile = async (uid, data) => {
  try {
    console.log(uid, data);
    if (data.userId !== undefined) {
      const q = query(
        collection(db, "users"),
        where("userId", "==", data.userId)
      );
      console.log(q);
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return {
          open: true,
          style: "error",
          message: "User Id already exist...",
        };
      }
    }

    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, {
      ...data,
    });
    return {
      open: true,
      message: "Profile updated succesfully...",
      style: "success",
    };
  } catch (error) {
    console.log(error);
    return { open: true, message: "Error updating profile...", style: "error" };
  }
};

//send forgot password link
const handleForgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      open: true,
      message: "Password reset link sent to your email...",
      style: "success",
    };
  } catch (error) {
    console.log(error);
    return {
      open: true,
      message: "Error sending password reset link...",
      style: "error",
    };
  }
};

const fetchUsers = async (uids) => {
  const userCollectionRef = collection(db, "users");
  try {
    const usersData = await Promise.all(
      uids.map(async (uid) => {
        const userDocRef = doc(userCollectionRef, uid);
        const userDocSnap = await getDoc(userDocRef);
        return userDocSnap.exists()
          ? {
              picture: userDocSnap.data().picture,
              userId: userDocSnap.data().userId,
              name: userDocSnap.data().name,
            }
          : null;
      })
    );
    return usersData.filter((post) => post !== null);
  } catch (error) {
    console.log(error);
  }
};

const searchUser = async (userId) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userId", "==", userId));

    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    return users;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const fetchReels = async () => {
  try {
    const reelsQuery = query(
      collection(db, "posts"),
      where("type", "==", "reel")
    ); // Filter by type
    const querySnapshot = await getDocs(reelsQuery);
    const fetchedReels = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return fetchedReels;
  } catch (err) {
    console.error("Error fetching reels:", err);
    return err;
  }
};

export {
  searchUser,
  fetchReels,
  fetchUsers,
  handleForgotPassword,
  updateProfilePicture,
  handleUpdateProfile,
  suggestionList,
  fetchUserDoc,
  Logout,
  handleGoogleAuth,
  handlePost,
  fetchPosts,
  uploadStory,
  following,
  unfollowing,
};
