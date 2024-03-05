import React from "react";
import { useState } from "react";
import io from "socket.io-client";
import Home from "./components/Login";
import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom";
import {Toaster} from "react-hot-toast";
import Editor from "./components/Editor";
import Chat from "./components/Chat";
import './App.css';


const App = () => {
  return (
    <BrowserRouter >
      <div>
        <Toaster position="top-center"></Toaster>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/editor/:roomId" element={<Codechat />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

//wrap Editor and Chat component together
const Codechat = () => {
  const location = useLocation();
  const username = location.state?.username;
  const [showChat, setShowChat] = useState(false);
  const toggleChat = () =>{ setShowChat(!showChat) };


  return (
      <div className="main">

        <div className={`editor ${showChat ? 'small': 'full'}`} >
          <button onClick={toggleChat} className="btn btn-dark toggle-button">
            {showChat ? 'Hide Chat-Room': 'Show Chat-Room'}
            </button>
          <Editor/>
        </div>

        {showChat && (
          <div className="chat" >
              <Chat username={username}/>
          </div>
        )}
      </div>
  );
};

export default App;





// const options = {
//   "force new connection": true,
//   reconnectionAttempt: "Infinity",
//   timeout: 10000,
//   transports: ["websocket"],
// };

// const url = "ws://localhost:5000";

// const socket = io(url, options);

// socket.on("connect", () => {
//   console.log("Socket connected:", socket.id);
// });

// socket.on("connect_error", (error) => {
//   console.error("Socket connection error:", error);
// });
// console.log(socket, socket.id)