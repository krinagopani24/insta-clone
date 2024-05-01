import { createContext, useContext, useRef, useState } from "react";
import Router from "./Router";
import SignUpAndLogin from "./Pages/User/SignupAndLogin";
import SnackBar from "./Components/SnackBar";
import { Box, CssBaseline } from "@mui/material";
import SideBar from "./Components/Sidebar";
import { AuthContext } from "./hooks/AuthContext";
import PopUpBox from "./Components/Model/PopUpBox";

export const SnackBarContext = createContext();

const App = () => {
  const { currentUser } = useContext(AuthContext);

  const [snackBar, setSnackBar] = useState({
    message: "",
    open: false,
    style: "success",
  });
  const mainBox = useRef(null);
  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBar((prevSnackBar) => ({ ...prevSnackBar, open: false }));
  };

  return (
    <SnackBarContext.Provider value={{ setSnackBar }}>
      {!currentUser ? (
        <SignUpAndLogin />
      ) : (
        <Box
          sx={{ height: "100%", width: "100%", display: "flex" }}
          ref={mainBox}
        >
          <CssBaseline />
          <SideBar />
          <Box
            height={"100%"}
            width={"100%"}
            sx={{ flexGrow: 1 }}
            className="p-1"
          >
            <div className=" rounded-md  border">
              <Router />
              {currentUser?.uid ? (
                <>
                <PopUpBox />
                </> 
              ) : null}
            </div>
          </Box>
        </Box>
      )}
      <SnackBar
        open={snackBar.open}
        message={snackBar.message}
        color={snackBar.style}
        handleClose={handleSnackBarClose}
      />
    </SnackBarContext.Provider>
  );
};

export default App;
