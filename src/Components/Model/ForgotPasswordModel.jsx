import { Box, Modal } from "@mui/material";
import InputBox from "../InputBox";
import { useContext, useState } from "react";
import { SnackBarContext } from "../../App";
import { Button } from "@material-tailwind/react";
import { handleForgotPassword } from "../../lib/firebase";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const ForgotPasswordModel = ({ open, setOpen }) => {
  const [email, setEmail] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  const { setSnackBar } = useContext(SnackBarContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => setOpen(false);
  const handleChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    if (field === "resetEmail") {
      if (!/^[A-Za-z0-9._@]*$/.test(value)) {
        setSnackBar({
          open: true,
          message: "enter valide Email ID...",
          style: "info",
        });
        return;
      } else {
        setEmailValidation("");
        setEmail(value);
        return;
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let number = 0;
    const errorMessage = [];
    if (email === "") {
      setEmailValidation("text-red-600 font-bold");
      number = 1;
    } else {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(email)) {
        setEmailValidation("text-red-600 font-bold");
        errorMessage.push(
          <li key={Math.random()}>Please enter right email...</li>
        );
        number = 2;
      }
    }

    if (number === 1) {
      setSnackBar({
        open: true,
        message: "fill Email field...",
        style: "error",
      });
    } else if (number === 2) {
      setSnackBar({
        open: true,
        message: (
          <ul>
            {errorMessage.map((value) => {
              return value;
            })}
          </ul>
        ),
        style: "error",
      });
    } else if (number === 0) {
      const message = await handleForgotPassword(email);
      setSnackBar(message);
    }
    setIsLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <InputBox
          labelValue={"email"}
          get={email}
          type={"email"}
          set={handleChange}
          id={"resetEmail"}
          validate={emailValidation}
        />
        <Button color="blue" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Loading..." : "Reset"}
        </Button>
      </Box>
    </Modal>
  );
};

export default ForgotPasswordModel;
