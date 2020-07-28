import React, {useEffect, useReducer} from 'react';
import axios from 'axios';
import socket from "./socket";
import reducer from "./reducer";
//styles
import './styles/login.scss'
import './styles/chat.scss'
//components
import Chat from "./components/Chat";
import Login from "./components/Login";


const  App = ()=> {
    const [state, dispatch] = useReducer(reducer,{
        joined: false,
        roomId: null,
        userName: null,
        users: [],
        messages: []
    });


    //in package we have proxy,which redirect any ajax to our backend
    const onLogin = async (object)=>{
        dispatch({
            type: 'JOINED',
            payload: object
        });
        socket.emit('room:join', object);
        const { data } = await axios.get(`/rooms/${object.roomId}`);
        dispatch({
            type: 'SET_DATA',
            payload: data,
        });
    };

    const setUsers = (users)=>{
        dispatch({
            type: 'SET_USERS',
            payload: users
        });
    }

    const addMessage = (message) => {
        dispatch({
            type: 'NEW_MESSAGE',
            payload: message,
        });
    };
    const startStream = () =>{
        dispatch({
            type: 'START_STREAM',
            payload: true
        })
    }

    useEffect(()=>{
        //socket.on can get only 1 action not array it cause we use 2 on's
        socket.on('room:set_users', setUsers);
        socket.on('room:new_message', addMessage);
    },[]);

    console.log(state)
  return (
    <div className="App">
        {
            !state.joined ?
                <Login onLogin={onLogin} /> :
                <Chat {...state} onAddMessage={addMessage} />
        }

    </div>
  );
}

export default App;
