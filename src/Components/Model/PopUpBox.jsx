import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useContext, useEffect, useRef, useState } from "react";
import InputBox from "../InputBox";
import { Button, Radio, Typography } from "@material-tailwind/react";
import { MdFemale, MdMale } from "react-icons/md";
import { SnackBarContext } from "../../App";
import { db, storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { AuthContext } from "../../hooks/AuthContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #B8CFEC",
  boxShadow: 24,
  p: 2,
};

const PopUpBox = () => {
  const { setSnackBar } = useContext(SnackBarContext);
  const { currentUser } = useContext(AuthContext);
  const genderRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: null,
    userId: "",
    picture: null,
  });
  const [validate, setValidate] = useState({
    dateOfBirth: null,
    gender: null,
    userId: null,
    picture: null,
  });

  useEffect(() => {
    if (
      currentUser?.dateOfBirth === null ||
      currentUser?.gender === null ||
      currentUser?.userId === null ||
      currentUser?.picture === null
    ) {
      console.log('popupbox')
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentUser?.dateOfBirth,
    currentUser?.gender,
    currentUser?.bio,
    currentUser?.picture,
  ]);

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

  const handleChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    if (field === "userId") {
      if (!/^[A-Za-z0-9._]*$/.test(value)) {
        setSnackBar({
          open: true,
          message: "A-Za-z0-9 . _ are only allowed...",
          style: "info",
        });
        return;
      } else {
        setValidate({ ...validate, [field]: "" });
        setFormData({ ...formData, [field]: value });
        return;
      }
    } else if (field === "dateOfBirth") {
      setValidate({ ...validate, [field]: "" });
      setFormData({ ...formData, [field]: value });
      return;
    } else if (field === "gender") {
      setValidate({ ...validate, [field]: "" });
      setFormData({ ...formData, [field]: value });
      return;
    }
  };

  const fileInputRef = useRef(null);
  const handleFileChange = async(event) => {
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

    setFormData({ ...formData, picture: selectedFile });
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    let updateData = {};
    let message = [];
    let number = 0;

    if (formData.userId === "" && currentUser?.userId === null) {
      setValidate((pre) => ({ ...pre, userId: "text-red-600 font-bold" }));
      message.push(<li key={Math.random()}>Enter User Id...</li>);
      number = 1;
    }
    if (currentUser?.userId === null && formData.userId !== "") {
      updateData = {
        userId: formData.userId,
      };
    }
    if (formData.dateOfBirth === "" && currentUser?.dateOfBirth === null) {
      setValidate((pre) => ({ ...pre, dateOfBirth: "text-red-600 font-bold" }));
      message.push(<li key={Math.random()}>Enter Date Of Birth...</li>);
      number = 1;
    }
    if (currentUser?.dateOfBirth === null && formData.dateOfBirth !== "") {
      updateData["dateOfBirth"] = formData.dateOfBirth;
    }
    if (formData.gender === null && currentUser?.gender === null) {
      setValidate((pre) => ({ ...pre, gender: "text-red-600 font-bold" }));
      message.push(<li key={Math.random()}>Select gender...</li>);
      number = 1;
    }
    if (currentUser?.gender === null && formData.gender !== null) {
      updateData["gender"] = formData.gender;
    }
    if (formData.picture === null && currentUser?.picture === null) {
      message.push(<li key={Math.random()}>Select Profile Picture...</li>);
      number = 1;
    }

    if (number === 1) {
      setSnackBar({
        open: true,
        message: (
          <ul>
            {message.map((value) => {
              return value;
            })}
          </ul>
        ),
        style: "error",
      });
      setIsLoading(false);
      return;
    } else {
      try {
        if (currentUser?.userId === null) {
          const q = query(
            collection(db, "users"),
            where("userId", "==", formData.userId)
          );
          const querySnapshot = await getDocs(q);
          // console.log(querySnapshot.doc());

          if (querySnapshot.docs.length > 0) {
            setSnackBar({
              open: true,
              style: "error",
              message: "User Id already exist...",
            });
            setIsLoading(false);
            return;
          }
        }
        if (currentUser?.picture === null && formData.picture !== null) {
          try {
            const storageRef = ref(storage, `profilePhoto/${currentUser?.uid}`);
            await uploadBytes(storageRef, formData.picture);
            const downloadUrl = await getDownloadURL(storageRef);
            updateData["picture"] = downloadUrl;
          } catch (error) {
            console.log(error);
            setIsLoading(false);
            return;
          }
        }
        const docRef = doc(db, "users", currentUser?.uid);
        await updateDoc(docRef, {
          ...updateData,
        });
        // authSetLoading(true);
        setSnackBar({
          open: true,
          message: "Profile Updated...",
          style: "success",
        });
      } catch (error) {
        console.log(error);
      }
    }
    setOpen(false);
    setIsLoading(false);
  };

  return (
    <Modal
      open={open}
      className="border-[0px]"
      // onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="space-y-3">
        {" "}
        {currentUser?.userId === null && (
          <InputBox
            labelValue={"User ID"}
            placeholder={"User ID"}
            get={formData.userId}
            set={handleChange}
            id={"userId"}
            validate={validate.userId}
          />
        )}
        {currentUser?.dateOfBirth === null && (
          <InputBox
            labelValue={"Date of Birth"}
            type={"date"}
            get={formData.dateOfBirth}
            set={handleChange}
            validate={validate.dateOfBirth}
            id={"dateOfBirth"}
          />
        )}
        {currentUser?.picture === null && (
          <div className="relative inline-flex items-center">
            <Button
              variant="gradient"
              color="blue"
              onClick={() => fileInputRef.current.click()}
            >
              Upload Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png, .jpg, .jpeg, .jfif, .pjpeg, .pjp, .heif, .heic" // Restrict accepted file types
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {formData.picture && (
              <img
                className="h-24 w-24 rounded-full object-fill object-center"
                src={URL.createObjectURL(formData.picture)}
                alt="Profile"
              />
            )}
          </div>
        )}
        {currentUser?.gender === null && (
          <div className="flex">
            <p ref={genderRef} className={`p-2 w-32 ${validate.gender}`}>
              gender
            </p>
            <div onMouseEnter={() => enter()} onMouseLeave={() => leave()}>
              <Radio
                className="before:w-10 before:h-10"
                name="gender"
                icon={<MdMale />}
                value="Male"
                checked={formData.gender === "Male"}
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
                checked={formData.gender === "Female"}
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
            </div>
          </div>
        )}
        <div className="flex justify-around items-center pt-3">
          <Button color="blue" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default PopUpBox;
