import { getDocs } from "firebase/firestore";
import { Radio, Typography, Button, Tooltip } from "@material-tailwind/react";
import { MdFemale, MdMale } from "react-icons/md";
import InputBox from "../../Components/InputBox";
import { useContext, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { SnackBarContext } from "../../App";
import {  createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, doc, query, setDoc, where } from "firebase/firestore";
import { handleGoogleAuth } from "../../lib/firebase";


const SignUp = () => {
  const { setSnackBar } = useContext(SnackBarContext);
  const [tooltip, setTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    gender: null,
    userId: "",
  });
  const [validate, setValidate] = useState({
    name: null,
    email: null,
    dateOfBirth: null,
    password: null,
    confirmPassword: null,
    gender: null,
    userId: null,
  });
  const genderRef = useRef(null);

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
        setValidate({ ...validate, [field]: "" });
        setFormData({ ...formData, [field]: value });
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
        setValidate({ ...validate, [field]: "" });
        setFormData({ ...formData, [field]: value });
        return;
      }
    } else if (field === "email") {
      if (!/^[A-Za-z0-9._@]*$/.test(value)) {
        setSnackBar({
          open: true,
          message: "enter valide Email ID...",
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
    } else if (field === "password") {
      if (!/^[^\s]*$/.test(value)) {
        setSnackBar({
          open: true,
          message: "White Space not allowed...",
          style: "error",
        });
        return;
      } else {
        setValidate({ ...validate, [field]: "" });
        setFormData({ ...formData, [field]: value });
        return;
      }
    } else if (field === "confirmPassword") {
      if (!/^[^\s]*$/.test(value)) {
        setSnackBar({
          open: true,
          message: "White Space not allowed...",
          style: "error",
        });
        return;
      } else {
        setValidate({ ...validate, [field]: "" });
        setFormData({ ...formData, [field]: value });
        return;
      }
    }
  };

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

  function cancel() {
    setFormData({
      name: "",
      email: "",
      dateOfBirth: "",
      password: "",
      userId: "",
      confirmPassword: "",
      gender: null,
    });
    setValidate({
      name: "",
      email: "",
      dateOfBirth: "",
      password: "",
      userId: "",
      confirmPassword: "",
      gender: "",
    });

    setSnackBar({
      open: true,
      message: "All field is cleared...",
      style: "info",
    });
  }

  const Submit = async () => {
    setIsLoading(true);
    let number = 0;
    let errorMessage = [];

    if (formData.userId === "") {
      setValidate((pre) => ({ ...pre, userId: "text-red-600 font-bold" }));
      number = 1;
    }
    if (formData.name === "") {
      setValidate((pre) => ({ ...pre, name: "text-red-600 font-bold" }));
      number = 1;
    }
    if (formData.email === "") {
      setValidate((pre) => ({ ...pre, email: "text-red-600 font-bold" }));
      number = 1;
    } else {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(formData.email)) {
        setValidate((pre) => ({ ...pre, email: "text-red-600 font-bold" }));
        errorMessage.push(
          <li key={Math.random()}>Please enter right email...</li>
        );
        number = 2;
      }
    }
    if (formData.dateOfBirth === "") {
      setValidate((pre) => ({ ...pre, dateOfBirth: "text-red-600 font-bold" }));
      number = 1;
    }

    if (formData.gender === null) {
      setValidate((pre) => ({ ...pre, gender: "text-red-600 font-bold" }));
      number = 1;
    }
    if (formData.password === "") {
      setValidate((pre) => ({ ...pre, password: "text-red-600 font-bold" }));
      number = 1;
    } else {
      const passwordRegex =
        /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[\W_])[a-zA-Z\d\W_]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setValidate((pre) => ({ ...pre, password: "text-red-600 font-bold" }));
        errorMessage.push(
          <li key={Math.random()}>password not match the requirement...</li>
        );
        number = 2;
      }
    }
    if (formData.confirmPassword === "") {
      setValidate((pre) => ({
        ...pre,
        confirmPassword: "text-red-600 font-bold",
      }));
      number = 1;
    } else {
      if (!(formData.password === formData.confirmPassword)) {
        setValidate((pre) => ({
          ...pre,
          confirmPassword: "text-red-600 font-bold",
        }));
        errorMessage.push(
          <li key={Math.random()}>
            Confirm password is deferante from password
          </li>
        );
        number = 2;
      }
    }
    if (number === 1) {
      setSnackBar({
        open: true,
        message: "please fill all field...",
        style: "error",
      });
    } else if (number === 2) {
      setSnackBar({
        open: true,
        message: (
          <ul>
            {errorMessage.map((message) => {
              return message;
            })}
          </ul>
        ),
        style: "error",
      });
    } else if (number === 0) {
      const data = {
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        userId: formData.userId,
        following:[],
        followers:[],
        story:[],
        post:[],
        reel:[],
        saved:[],
        email: formData.email,
        bio:"",
        picture:null
      };
      try {
        const q = query(
          collection(db, "users"),
          where("userId", "==", data.userId)
        );
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.docs.length > 0) {
          setSnackBar({
            open: true,
            style: "error",
            message: "User Id already exist...",
          });
          setIsLoading(false);
          return;
        } else {
          createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          )
            .then(async (usercred) => {
              const userRef = doc(db, "users", usercred.user.uid);
              await setDoc(userRef, {...data,uid:usercred.user.uid});
              await setDoc(doc(db, "userChats", usercred.user.uid), {});
            })
            .catch((error) => {
              setSnackBar({
                open: true,
                style: "error",
                message: error.message,
              });
              console.log(error);
            });
        }
      } catch (error) {
        console.log(error);
        setSnackBar({
          open: true,
          message: "Something went wrong,Try Again...",
          style: "error",
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-3 w-[75%]">
      <InputBox
        labelValue={"User ID"}
        get={formData.userId}
        set={handleChange}
        id={"userId"}
        validate={validate.userId}
      />
      <InputBox
        labelValue={"Name"}
        get={formData.name}
        set={handleChange}
        id={"name"}
        validate={validate.name}
      />
      <InputBox
        labelValue={"Email"}
        get={formData.email}
        set={handleChange}
        id={"email"}
        validate={validate.email}
      />
      <InputBox
        labelValue={"Date of Birth"}
        type={"date"}
        get={formData.dateOfBirth}
        set={handleChange}
        validate={validate.dateOfBirth}
        id={"dateOfBirth"}
      />
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
      <Tooltip
        placement="right"
        // target="focus"
        open={tooltip}
        className="bg-gray-200 text-black"
        content={
          <ul>
            <li>enter at list one Chapital Charactor</li>
            <li>enter at list one small Charactor</li>
            <li>enter at list one number</li>
            <li>enter at list one special Charactor</li>
            <li>at list 8 Charactor long</li>
          </ul>
        }
      >
        <div onFocus={() => setTooltip(true)} onBlur={() => setTooltip(false)}>
          <InputBox
            labelValue={"Password"}
            type={"password"}
            get={formData.password}
            set={handleChange}
            id={"password"}
            validate={validate.password}
          />
        </div>
      </Tooltip>
      <InputBox
        labelValue={"C. Password"}
        type={"password"}
        placeholder={"Confirm Password"}
        get={formData.confirmPassword}
        set={handleChange}
        id={"confirmPassword"}
        validate={validate.confirmPassword}
      />
      <div className="flex justify-around items-center pt-3">
        <Button color="red" onClick={cancel}>
          Cancel
        </Button>
        <Button color="blue" onClick={Submit} disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </div>
      <div className="flex justify-around">
        <Button
          color="blue"
          className="flex items-center gap-3 font-extrabold"
          onClick={handleGoogleAuth}
        >
          <FcGoogle className="h-5 w-5" /> SignUp with Google
        </Button>
      </div>
    </div>
  );
};

export default SignUp;
