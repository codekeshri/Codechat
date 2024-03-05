import React from 'react'

const Message = ({user, message}) => {
  console.log("Message Props: ", {user, message})
  return (
    <div className='messageBox'>
       <strong>{user}:</strong> {message}
    </div>
  )
}

export default Message