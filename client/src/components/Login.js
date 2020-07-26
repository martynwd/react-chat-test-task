import React, {useState} from "react";
//import socket from "../socket";

const MainPage = ()=>{
    const [roomId,setRoomId] = useState('');
    const [userName,setUsername] = useState('');

    const onEnter = ()=>{
        if (!roomId || !userName){
            return console.log('wrong data')
        }
        console.log(roomId)
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
            >
                Enter
            </button>
        </div>
    )

}

export default MainPage;
