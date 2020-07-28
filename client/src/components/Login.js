import React, {useState} from "react";
import axios from 'axios'


const Login = ({ onLogin } )=>{
    const [roomId,setRoomId] = useState('');
    const [userName,setUsername] = useState('');
    const [isLoading, setLoading] = useState(false);

    const onEnter = async ()=>{
        if (!roomId || !userName){
            return console.log('wrong data')
        }
        setLoading(true);
        const data ={
            roomId,
            userName
        }
        await axios.post('/rooms', data);
        onLogin(data);

    }
    return(
        <div className="main">
            <input
                type="text"
                placeholder="Room id"
                value={roomId}
                onChange={event => setRoomId(event.target.value)}
                className="main__input"
            />
            <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={event => setUsername(event.target.value)}
                className="main__input"
            />
            <button
                className="main__button btn btn-success"
                onClick={onEnter}
                disabled={isLoading}
            >
                {isLoading ? 'Connecting...' : 'Enter'}
            </button>
        </div>
    )

}

export default Login;
