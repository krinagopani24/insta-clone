import { Button, Tooltip } from "@material-tailwind/react";
import InputBox from "../../Components/InputBox";
import { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { SnackBarContext } from "../../App";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { handleGoogleAuth } from "../../lib/firebase";

const Login = () => {
  const { setSnackBar } = useContext(SnackBarContext);
  const [isLoading, setIsLoading] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const [formData, setFormData] = useState({
    logInPassword: "",
    logInUserId: "",
  });
  const [validate, setValidate] = useState({
    logInPassword: null,
    logInUserId: null,
  });

  const handleChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    if (field === "logInUserId") {
      if (!/^[A-Za-z0-9._@]*$/.test(value)) {
        setSnackBar({
          open: true,
          message: "A-Za-z0-9 . _ @ are only allowed...",
          style: "info",
        });
        return;
      } else {
        setValidate({ ...validate, [field]: "" });
        setFormData({ ...formData, [field]: value });
        return;
      }
    } else if (field === "logInPassword") {
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

  function cancel() {
    setFormData({
      logInPassword: "",
      logInUserId: "",
    });
    setValidate({
      logInPassword: "",
      logInUserId: "",
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

    if (formData.logInUserId === "") {
      setValidate((pre) => ({ ...pre, logInUserId: "text-red-600 font-bold" }));
      number = 1;
    }

    if (formData.logInPassword === "") {
      setValidate((pre) => ({
        ...pre,
        logInPassword: "text-red-600 font-bold",
      }));
      number = 1;
    } else {
      const passwordRegex =
        /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[\W_])[a-zA-Z\d\W_]{8,}$/;
      if (!passwordRegex.test(formData.logInPassword)) {
        setValidate((pre) => ({
          ...pre,
          logInPassword: "text-red-600 font-bold",
        }));
        errorMessage.push(
          <li key={Math.random()}>password not match the requirement...</li>
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
      try {
        await signInWithEmailAndPassword(
          auth,
          formData.logInUserId,
          formData.logInPassword
        );
        setSnackBar({
          open: true,
          message: "Login Successfull...🤗🤩",
          style: "success",
        });
        // Handle successful sign-in (e.g., redirect to home page)
      } catch (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        // const errorMessage = error.message;
        console.log(errorCode);
        if (errorCode === "auth/wrong-password") {
          errorMessage = "Wrong password...🤐";
        } else if (errorCode === "auth/user-not-found") {
          errorMessage = "User not found...🥴";
        } else if (errorCode === "auth/invalid-email") {
          errorMessage = "Invalid email...🤔";
        } else if (errorCode === "auth/too-many-requests") {
          errorMessage =
            "Too many requests...,Please comeback after sometime🫡🫡";
        } else if (errorCode === "auth/user-disabled") {
          errorMessage = "User disabled...😖";
        } else if (errorCode === "auth/network-request-failed") {
          errorMessage = "Network request failed...😶";
        } else if (errorCode === "auth/internal-error") {
          errorMessage = "Internal error...🤖";
        } else if (errorCode === "auth/invalid-credential") {
          errorMessage = "Invalid credential...🤐🤔";
        } else {
          errorMessage = "Unknown error...";
        }
        setSnackBar({
          open: true,
          message: errorMessage,
          style: "error",
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-3 w-[75%]">
      <InputBox
        labelValue={"Email ID"}
        placeholder={"Email ID"}
        get={formData.logInUserId}
        set={handleChange}
        id={"logInUserId"}
        validate={validate.logInUserId}
      />

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
            get={formData.logInPassword}
            set={handleChange}
            id={"logInPassword"}
            validate={validate.logInPassword}
          />
        </div>
      </Tooltip>

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
          <FcGoogle className="h-5 w-5" /> Login with Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
