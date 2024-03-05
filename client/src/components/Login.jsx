import React, { useState } from "react";
import  { v4 as uuidV4} from "uuid";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();
    const [newIDE, setNewIDE] = useState('');
    const [username, setUsername] = useState('');

    const createNewIDE = (e) =>{
            e.preventDefault(); 
            const id = uuidV4();
            setNewIDE(id);
            toast.success("Your new IDE created");
    }


    // Button function
    const signIn = () =>{

        if(!username){
            toast.error('Username Required');
            return;
        }
        if(!newIDE){
            toast.error("Secretkey Required");
            return;
        }

        navigate(`/editor/${newIDE}`, {
            state: {                                 
                    username, 
            }
        })

    }




  return <div className="login">
            <img src="/code.png" alt="logo" className="logo" />
            <div className=" form">
                <h1>SignIn</h1><br />
                <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)}/> <br />
                <input type="text" className="form-control" placeholder="Secretkey" value={newIDE} onChange={(e)=>setNewIDE(e.target.value)}/> <br />
                <button className="btn btn-success" onClick={signIn}>Sign In</button> <br /><br />
                <span className="createInfo">
                    New users can get token here &nbsp;
                    <a href="" className="createNewIDE" onClick={createNewIDE}>Access IDE</a>
                </span>
                
            </div>
        </div>
       
};

export default Home;
