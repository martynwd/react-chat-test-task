import React, {useEffect, useRef, useState} from 'react';
import socket from '../socket';
import Peer from 'simple-peer'



const Chat = ({ users, messages, userName, roomId, onAddMessage })=> {
    const [messageValue, setMessageValue] = useState('');
    const [yourID, setYourID] = useState("");
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);

    const messagesRef = useRef(null);
    const userVideo = useRef();
    const partnerVideo = useRef();


    const onSendMessage = () => {
        socket.emit('room:new_message', {
            userName,
            roomId,
            text: messageValue,
        });
        onAddMessage({ userName, text: messageValue });
        setMessageValue('');
    };

    useEffect(() => {
        messagesRef.current.scrollTo(0, 99999);
    }, [messages]);

    useEffect(() => {

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setStream(stream);
            if (userVideo.current) {
                userVideo.current.srcObject = stream;
            }
        })

        socket.on("room:get_current_id", (id) => {
            setYourID(id);
        })


        socket.on("room:call_user", (data) => {
            setReceivingCall(true);
            setCaller(users[yourID]);

            setCallerSignal(data.signal);
        })
    }, []);

    function callPeer(id) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });

        peer.on("signal", data => {
            socket.emit("room:call_user", { userToCall: id, signalData: data, from: yourID })
        })

        peer.on("stream", stream => {
            if (partnerVideo.current) {
                partnerVideo.current.srcObject = stream;
            }
        });

        socket.on("room:accepted_call", signal => {
            setCallAccepted(true);
            peer.signal(signal);
        })

    }

    function acceptCall() {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });
        peer.on("signal", data => {
            socket.emit("room:accept_call", { signal: data, to: caller })
        })

        peer.on("stream", stream => {
            partnerVideo.current.srcObject = stream;
        });

        peer.signal(callerSignal);

    }

    let UserVideo;
    if (stream) {
        UserVideo = (
            <video playsInline muted ref={userVideo} autoPlay />
        );
    }

    let PartnerVideo;
    if (callAccepted) {
        PartnerVideo = (
            <video playsInline ref={partnerVideo} autoPlay />
        );
    }

    let incomingCall;
    if (receivingCall) {
        incomingCall = (
            <div>
                <h1>You have a call</h1>
                <button className="btn btn-primary" onClick={acceptCall}>Accept</button>
            </div>
        )
    }

    return (
        <div className="chat">
            <div className="chat__users">
                Комната: <b>{roomId}</b>
                <hr />
                <b>Онлайн ({users.length}):</b>
                <ul className="chat__users_list">
                    {users.map((user, index) => (
                        <li key={user.userName + index} className="chat__users_list_element">
                            {
                                user.userName
                            }
                            {
                               <button className="chat__users_button btn btn-primary" onClick={() => callPeer(user.id)}>Call {user.userName}</button>

                            }
                        </li>
                    ))}

                </ul>
            </div>


            <div className="chat__messages">
                <div ref={messagesRef} className="messages">
                    {messages.map((message) => (
                        <div className="chat__message">
                            <p className="chat__message_text">{message.text}</p>
                            <div>
                                <span className="chat__message_title">{message.userName}</span>
                            </div>
                        </div>
                    ))}
                </div>
                {userVideo.current}
         <form className="chat__messages_form">
          <textarea
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              className="form-control chat__messages_textarea"
              rows="3"

          >
          </textarea>
                    <button onClick={onSendMessage} type="button" className="chat__button btn btn-primary">
                        Отправить
                    </button>

                </form>

                {PartnerVideo}
                {incomingCall}
            </div>

        </div>
    );
}

export default Chat;
