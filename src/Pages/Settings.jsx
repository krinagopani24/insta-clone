import { useContext, useEffect, useRef, useState } from "react";
import { Radio, Button } from "@material-tailwind/react";
import { AuthContext } from "../hooks/AuthContext";
import { Box, Typography, Avatar } from "@mui/material";
import { SnackBarContext } from "../App";
import InputBox from "../Components/InputBox";
import { MdFemale, MdMale } from "react-icons/md";
import { handleUpdateProfile, updateProfilePicture } from "../lib/firebase";
import ChangePassword from "../Components/profile/ChangePassword";

const Settings = () => {
  const { currentUser } = useContext(AuthContext);
  const { setSnackBar } = useContext(SnackBarContext);
  const [userData, setUserData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const genderRef = useRef(null);
  const enter = () =>
    genderRef.current.classList.add(
      "text-lg",
      "font-mono",
      "font-bold",
      "text-sky-400"
    );
  const leave = () =>
    genderRef.current.classList.remove(
      "text-lg",
      "font-mono",
      "font-bold",
      "text-sky-400"
    );

  const [validate, setValidate] = useState({
    name: null,
    email: null,
    dateOfBirth: null,
    password: null,
    confirmPassword: null,
    gender: null,
    userId: null,
  });

  useEffect(() => {
    setUserData(currentUser);
    console.log(currentUser);
  }, [currentUser]);

  //handle Profile Picture
  const fileInputRef = useRef(null);
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return; // Handle no file selected

    // Validate file type (optional)
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/jfif",
      "image/pjpeg",
      "image/pjp",
      "image/heif",
      "image/heic",
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      setSnackBar({
        open: true,
        message:
          "Only PNG, JPG, JPEG, JFIF, PJPEG, PJP, HEIF, HEIC are allowed...",
        style: "info",
      });
      return;
    }

    // Validate file size (optional)
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
    if (selectedFile.size > maxSize) {
      setSnackBar({
        open: true,
        message: "File size is too large. Please select an image under 2 MB.",
        style: "error",
      });
      return;
    }
    setPreviewImage(URL.createObjectURL(selectedFile));
    setUserData((pre) => ({ ...pre, picture: selectedFile }));
  };

  const handleChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    if (field === "name") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        setSnackBar({
          open: true,
          message: "Only Charactor is allowed...",
          style: "info",
        });
        return;
      } else {
        setValidate((pre) => ({ ...pre, [field]: "" }));
        setUserData((pre) => ({ ...pre, [field]: value }));
        return;
      }
    } else if (field === "userId") {
      if (!/^[A-Za-z0-9_]*$/.test(value)) {
        setSnackBar({
          open: true,
          message: "A-Za-z0-9 _ are only allowed...",
          style: "info",
        });
        return;
      } else {
        setValidate((pre) => ({ ...pre, [field]: "" }));
        setUserData((pre) => ({ ...pre, [field]: value }));
        return;
      }
    } else if (field === "dateOfBirth") {
      setValidate((pre) => ({ ...pre, [field]: "" }));
      setUserData((pre) => ({ ...pre, [field]: value }));
      return;
    } else if (field === "gender") {
      setValidate((pre) => ({ ...pre, [field]: "" }));
      setUserData((pre) => ({ ...pre, [field]: value }));
      return;
    } else if (field === "bio") {
      setValidate((pre) => ({ ...pre, [field]: "" }));
      setUserData((pre) => ({ ...pre, [field]: value }));
      return;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const data = {
      name: userData?.name,
      gender: userData?.gender,
      dateOfBirth: userData?.dateOfBirth,
      bio: userData?.bio,
    };
    if (userData?.userId !== currentUser?.userId) {
      data.userId = userData?.userId;
    }
    const uid = userData.uid;
    if (typeof userData.picture !== "string") {
      const file = userData.picture;
      const url = await updateProfilePicture(uid, file);
      data.picture = url;
    }
    const message = await handleUpdateProfile(uid, data);

    setSnackBar({ ...message });
    setIsLoading(false);
  };

  return (
    <>
      <Box
        sx={{
          height: "100%",
          width: "97%",
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
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          boxSizing: "border-box",
          border: "1px solid #e0e0e0",
          color: "black",
          fontSize: "16px",
          fontWeight: "400",
          lineHeight: "24px",
        }}
      >
        <Box>
          <Typography sx={{ lineHeight: "1.5", fontSize: "2em" }}>
            Edit profile
          </Typography>
          {/* Edit profile component */}
          <Box
            sx={{
              height: "20%",
              width: "50%",
              display: "flex",
              gap: "20px",
              backgroundColor: "#F7FAFA",
              borderRadius: "10px",
              boxShadow: "0px 0px 10px #A3F0F1",
              ":hover": {
                boxShadow: "0px 0px 10px #7CF1F3",
              },
              marginTop: "20px",
              marginBottom: "20px",
              p: 2,
              position: "relative",
              zIndex: "2",
              overflow: "hidden",
              transition: "all 0.3s ease-in-out",
              boxSizing: "border-box",
              border: "1px solid #e0e0e0",
              color: "black",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{ height: "100%", width: "100%", display: "flex" }}
              className="space-x-4"
            >
              <Avatar
                alt={userData.name}
                src={previewImage || userData.picture}
                sx={{ height: "70px", width: "70px", cursor: "pointer" }}
                onClick={() => fileInputRef.current.click()}
              />
              <Box sx={{ alignItems: "center" }}>
                <Typography sx={{ lineHeight: "1.5", fontSize: "1.5em" }}>
                  {userData.userId}
                </Typography>
                <Typography sx={{ lineHeight: "1.5", fontSize: "1.2em" }}>
                  {userData.name}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="gradient"
              color="blue"
              className="h-[70%] w-[33%]"
              onClick={() => fileInputRef.current.click()}
            >
              Change Profile
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png, .jpg, .jpeg, .jfif, .pjpeg, .pjp, .heif, .heic" // Restrict accepted file types
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Box>
          <Box sx={{ width: "50%" }} className="space-y-3">
            <InputBox
              labelValue={"User ID"}
              get={userData?.userId || ""}
              set={handleChange}
              id={"userId"}
              validate={validate?.userId || ""}
            />
            <InputBox
              labelValue={"Name"}
              get={userData?.name || ""}
              set={handleChange}
              id={"name"}
              validate={validate?.name}
            />
            <InputBox
              labelValue={"Date of Birth"}
              type={"date"}
              get={userData?.dateOfBirth || ""}
              set={handleChange}
              validate={validate?.dateOfBirth}
              id={"dateOfBirth"}
            />
            <Box className="flex">
              <p ref={genderRef} className={`p-2 w-36 ${validate.gender}`}>
                gender
              </p>
              <Box onMouseEnter={() => enter()} onMouseLeave={() => leave()}>
                <Radio
                  className="before:w-10 before:h-10"
                  name="gender"
                  icon={<MdMale />}
                  value="Male"
                  checked={userData.gender === "Male"}
                  onChange={handleChange}
                  label={
                    <Typography
                      color="blue-gray"
                      className="flex font-medium text-blue-gray-500"
                    >
                      Male
                    </Typography>
                  }
                />
                <Radio
                  name="gender"
                  value="Female"
                  checked={userData.gender === "Female"}
                  onChange={handleChange}
                  icon={<MdFemale />}
                  className="before:w-10 before:h-10"
                  label={
                    <Typography
                      color="blue-gray"
                      className="flex font-medium text-blue-gray-500"
                    >
                      Female
                    </Typography>
                  }
                />
              </Box>
            </Box>
            <InputBox
              labelValue={"Bio"}
              placeholder={"bio..."}
              get={userData?.bio || ""}
              set={handleChange}
              validate={validate?.bio}
              id={"bio"}
              textArea={true}
            />
            <Box className="flex justify-around items-center pt-3">
              <Button color="blue" disabled={isLoading} onClick={handleSubmit}>
                {isLoading ? "Loading..." : "Update"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      {currentUser.provider === "password" ? (
        <ChangePassword setSnackBar={setSnackBar} currentUser={currentUser} />
      ) : null}
      <Box
        sx={{
          height: "100%",
          width: "97%",
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
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          boxSizing: "border-box",
          border: "1px solid #e0e0e0",
          color: "black",
          fontSize: "16px",
          fontWeight: "400",
          lineHeight: "24px",
        }}
      >
        <Typography sx={{ lineHeight: "1.5", fontSize: "2em" }}>
          general Settings
        </Typography>
        <Box>
          <Typography sx={{ lineHeight: "1.5", fontSize: "1.3em" }}>
            We will be adding more settings in the future. Stay tuned! 😉 💪 💪
            💪 💪 💪 � ...
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Settings;
