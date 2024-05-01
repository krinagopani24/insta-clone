import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./hooks/AuthContext";

export default  function ProtectedRoute({ Component }) {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);


  useEffect(() => {
    // Check if the 'auth_token' cookie exists
    if (!currentUser) {
      navigate("/Login");
    }
  }, [currentUser, navigate]);

  return <Component />;
}
