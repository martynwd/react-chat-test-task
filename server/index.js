import express from 'express';
import useSocket from 'socket.io';
import server from 'http';
import dotenv from 'dotenv';

//import rooms from "./data/rooms.js";


dotenv.config();

const app = express();
app.use(express.json());


const Server = server.createServer(app);
const io = useSocket(Server);

const rooms = new Map();


app.get("/rooms/:id",(req, res)=>{
    console.log(req.params);
    const { id: roomId } =req.params;
    const object = rooms.has(roomId) ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
    } : { users: [], messages: []}
    res.json(object);
})
app.post("/rooms",(req, res)=>{
    const { roomId, userName } = req.body;
    if(!rooms.has(roomId)){
        rooms.set(roomId, new Map([
            ['users',new Map()],
            ['messages', [] ],
        ]));
    }
    //console.log(rooms);
    res.json([...rooms.keys()]);
})
io.on('connection',socket=>{
    socket.on('room:join',({roomId, userName})=>{
        socket.join(roomId);
        rooms.get(roomId).get('users').set(socket.id, userName);
        const users =  [...rooms.get(roomId).get('users').values()];
        socket.to(roomId).broadcast.emit('room:set_users',users)
    });

    socket.on('room:new_message', ({ roomId, userName, text }) => {
        const obj = {
            userName,
            text,
        };
        rooms.get(roomId).get('messages').push(obj);
        socket.to(roomId).broadcast.emit('room:new_message', obj);
    });

    socket.on('disconnect',()=>{
        rooms.forEach((value, roomId) => {
            //if user found and deleted return true
            if(value.get('users').delete(socket.id)){
                const users =  [...rooms.get(roomId).get('users').values()];
                socket.to(roomId).broadcast.emit('room:set_users',users)
            }
        });
    });
    console.log('user connected', socket.id);
})



Server.listen(process.env.PORT, (err)=>{
   if(err){
       throw Error (err);
   }
   console.log(`listening port ${process.env.PORT}`);
})













