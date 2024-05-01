import { useState } from "react";
import { Button } from "@material-tailwind/react";
import Login from "./Login";
import { Typography } from "@material-tailwind/react";
import SignUp from "./SignUp";
import ForgotPasswordModel from "../../Components/Model/ForgotPasswordModel";

function SignUpAndLogin() {
  const [toggle, setToggle] = useState(true);
  const [open, setOpen] = useState(false);

  const handleForgotPass = () => {
    setOpen(true);
  };

  return (
    <div className="w-screen h-screen bg-primary flex justify-center items-center ">
      <div className="bg-[#fff] rounded-xl shadow-custom relative overflow-hidden w-3/4 max-w-full min-h-[600px]">
        <div
          className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 opacity-0 z-[1] ${
            !toggle ? "translate-x-full opacity-100 z-[5]" : null
          }`}
        >
          <form className="bg-secondary flex items-center justify-center flex-col py-[50px] h-full text-center">
            <SignUp />
          </form>
        </div>
        <div
          className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 z-[2] ${
            !toggle ? "translate-x-full" : null
          }`}
        >
          <form className="bg-secondary flex items-center justify-center flex-col py-[50px] h-full text-center">
            <Login />
          </form>
        </div>
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100] ${
            toggle ? null : "-translate-x-full"
          }`}
        >
          <div
            style={{ backgroundPosition: "0 0" }}
            className={`bg-[#ff416c] bg-[url("img/com/login.jpg")] bg-no-repeat bg-cover text-[#ffffff] relative -left-full h-full w-[200%] translate-x-0 transition-transform duration-700 ease-in-out ${
              toggle ? null : "translate-x-1/2"
            }`}
          >
            <div
              className={`absolute flex items-center justify-center flex-col py-10 text-center top-0 h-full w-4/5 transition-transform duration-700 ease-in-out translate-x-[-20%] ${
                toggle ? null : "translate-x-0"
              }`}
            >
              <Typography variant="h2">Welcome Back!</Typography>
              <Typography variant="paragraph">
                To keep connected with us please login with your personal info
              </Typography>
              <Button
                color="white"
                className="text-white px-10 py-3 mt-6 rounded-full"
                variant="outlined"
                onClick={() => setToggle(!toggle)}
              >
                Sign In
              </Button>
              <Typography
                onClick={handleForgotPass}
                variant="paragraph"
                className="pt-6 cursor-pointer text-[#FF33DA]"
              >
                Forgot Password...
              </Typography>
            </div>
            <div
              className={`absolute flex items-center justify-center flex-col py-10 text-center top-0 h-full w-1/2 translate-x-0 transition-transform duration-700 ease-in-out right-0 ${
                toggle ? null : "translate-x-[20%]"
              } `}
            >
              <Typography variant="h2">Hello, Friend!</Typography>
              <Typography variant="paragraph">
                Enter your personal details and start journey with us
              </Typography>
              <Button
                color="white"
                className="text-white px-10 py-3 mt-6 rounded-full"
                variant="outlined"
                onClick={() => setToggle(!toggle)}
              >
                Sign Up
              </Button>
              <Typography
                onClick={handleForgotPass}
                variant="paragraph"
                className="pt-6 cursor-pointer"
                color="deep-purple"
              >
                Forgot Password...
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <ForgotPasswordModel open={open} setOpen={setOpen}/>
    </div>
  );
}

export default SignUpAndLogin;
