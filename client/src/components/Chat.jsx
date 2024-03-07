
import React, { useEffect, useState, useRef } from 'react';
import { initSocket } from '../socket';
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
        setMessages((prevMessages)=>{
         const updatedMessages =  [...prevMessages, data];
        return updatedMessages;
        })
        
      });

      return () => {
        newSocket.disconnect();
        console.log('Socket disconnected');
      };
    };

    setupSocket();
    
    return () => {                                 // Cleanup function
      if (socket) {
        socket.disconnect();
        console.log('Socket disconnected');
      }
    };
  }, []);                                          // Empty dependency array means this effect runs only once 


  const send = async() => {
    try{
      const newMessage = inputRef.current.value;

      if (socket && newMessage.trim() !=="") {

          const data = {message: newMessage, user: username};

          console.log('pre axios', data)


          const res = await axios.post('http://localhost:3000/chat/send', data);
          console.log(res);
          


          console.log('axios post req successful')
          
          socket.emit('send-message', data);
          
          inputRef.current.value = '';
          
      }
    }catch(err){
      console.log("send error", err)
    }
  };


  return (
    <> 
      <div className='chat-container' >
        {messages.map(({user, message}, index)=>( <div key={index}><strong>{user}</strong> {message}<br /></div>))}
      </div>
      <div className="input">
        <input ref= {inputRef} type="text" className="form-control inputMessage" id="inputMessage" placeholder="Your message" />
        <button className="btn btn-success send" onClick={send}> Send</button>
      </div>
      
    </>
  );
};

export default Chat;















          // await fetch('/chat/send', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify(data),
          // });