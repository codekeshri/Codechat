
import React, { useEffect, useState, useRef } from 'react';
import { initSocket } from '../socket';
import ReactScrollToBottom from 'react-scroll-to-bottom';
// import Message from './Message';
import axios from 'axios';

const Chat = ({ username }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([{ user: 'John', message: 'Hello' }]);
  const inputRef = useRef(null);

  useEffect(() => {
    const setupSocket = async () => {
      const newSocket = await initSocket();
      setSocket(newSocket);

      newSocket.on('receive-message', (data) => {
        setMessages((prevMessages)=>[...prevMessages, data]);
      });

      return () => {
        newSocket.disconnect();
        console.log('Socket disconnected');
      };
    };

    setupSocket();

    // Cleanup function
    return () => {
      if (socket) {
        socket.disconnect();
        console.log('Socket disconnected');
      }
    };
  }, []); // Empty dependency array means this effect runs only once

  const send = async() => {
    try{
      const newMessage = inputRef.current.value;
      await axios.post('http://localhost:3000/chat/send', {username, newMessage});
      console.log('message sent successfully', username, newMessage)

      if (socket && newMessage.trim() !=="") {

          const data = {message: newMessage, user: username};

          socket.emit('send-message', data);
          
          inputRef.current.value = '';
          
      }
    }catch(err){
      console.log("send error", err)
    }
  };

  console.log('Rendering with messages:', messages);

  return (
    <> 
      <div className='chat-container' >
        {/* <ReactScrollToBottom className='chat' smoothScroll> */}
        {/* {messages.map(({user, message}, index)=> (<Message key={index} data={{user: user, message: message}}/>))} */}
        {messages.map(({user, message})=>{
              return <><strong>{user}</strong> {message}<br /></>
        })}
        {/* </ReactScrollToBottom> */}
      </div>
      <div className="input">
        <input ref= {inputRef} type="text" className="form-control inputMessage" id="inputMessage" placeholder="Your message" />
        <button className="btn btn-success send" onClick={send}> Send</button>
      </div>
      
    </>
  );
};

export default Chat;
