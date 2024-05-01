import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../hooks/AuthContext";
import { timeConverter } from "../../../utils/timeConvet";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref} 
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageContent">
        {message.img && <img src={message.img} alt="" />}
        <p>{message.text}</p>
        <span>{timeConverter(message.date)}</span>
      </div>
    </div>
  );
};

export default Message;

