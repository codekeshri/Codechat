import React, {useState, useRef, useEffect} from "react";
import ACTIONS from "../Actions";
import {initSocket} from "../socket";
import {useLocation, useNavigate, Navigate, useParams} from "react-router-dom";
import {toast} from "react-hot-toast";
import Dracula from "./Dracula";

const Editor = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const {newIDE} = useParams();

  const [coders, setCoders] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("socket connection failed");
        navigate("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        username: location.state?.username,
        newIDE,
      });

      // Listening for joined events
      socketRef.current.on(ACTIONS.JOINED, ({coders, username, socketId}) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room`);
          console.log(`${username} joined`);
        }

        setCoders(coders);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          socketId: socketId,
          code: codeRef.current,
        });
      });
      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username}) => {
        toast.success(`${username} left the room`);
        setCoders((prev) => {
          return prev.filter((coder) => {
            return coder !== socketId;
          });
        });
      });
    };

    init();

    //important to clear listening on to avoid memory leak using cleaning function that is being returned from a useEffect
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <>
          <Dracula
            socketRef={socketRef} 
            roomId={newIDE}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
    </>
  );
};

export default Editor;


