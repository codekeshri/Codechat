
import React, { useEffect, useState, useRef } from 'react';
import { initSocket } from '../socket';
import ReactScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message';

const Chat = ({ username }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([{ user: 'John', message: 'Hello' }]);
  const [newMessage, setNewMessage] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const setupSocket = async () => {
      const newSocket = await initSocket();
      setSocket(newSocket);

      newSocket.on('receive-message', (data) => {
        console.log("socket send-message listening",data.user, data.message);
        console.log(data.user, messages)
        setNewMessage(data.message)
        setMessages([...messages, data]);
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

  const send = () => {
    try{
        const newMessage = inputRef.current.value;
        console.log(">>>>>>>>>>>>>>>>>>>", newMessage)
      if (socket && newMessage) {
        // setNewMessage(newMessage)
        if (newMessage.trim() !== "") {
          const data = {message: newMessage, user: username};
          console.log('data send', data);
          socket.emit('send-message', data)
          setMessages([...messages, data]);
          console.log("clicked", newMessage, messages, username, data)
          setNewMessage('');
          document.getElementById('inputMessage').value = '';
          
        }
      }
    }catch(err){
      console.log("send error", err)
    }
  };



  return (
    <> 
      <div className='chat-container' >
        {/* <ReactScrollToBottom className='chat' smoothScroll> */}
        {/* {messages.map(({user, message}, index)=> (<Message key={index} data={{user: user, message: message}}/>))} */}
        {messages.map(({user, message})=>{
              return <><strong>{user}</strong>: {message},<br /></>
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
