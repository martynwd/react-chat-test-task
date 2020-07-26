import express from 'express';
import useSocket from 'socket.io';
import server from 'http';
import dotenv from 'dotenv';



dotenv.config();

const app = express();
app.use(express.json());

const Server = server.createServer(app);
const io = useSocket(Server);

Server.listen(process.env.PORT, (err)=>{
   if(err){
       throw Error (err);
   }
   console.log(`listening port ${process.env.PORT}`);
})













