import React, {useEffect, useRef, useState} from 'react';
import socket from '../socket';

const Chat = ({ users, messages, userName, roomId, onAddMessage })=> {
    const [messageValue, setMessageValue] = useState('');
    const messagesRef = useRef(null);

    const onSendMessage = () => {
        socket.emit('room:new_message', {
            userName,
            roomId,
            text: messageValue,
        });
        onAddMessage({ userName, text: messageValue });
        setMessageValue('');
    };


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


            </div>

        </div>
    );
}

export default Chat;
