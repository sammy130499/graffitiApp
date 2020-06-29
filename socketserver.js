const express = require('express');
const cors = require('cors');
const http=require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

app.set('socketio',io);
app.set('server', server);
let numClients = {};
let clients={}


app.use(cors);

mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(res => console.log('db connected'))
    .catch(e => console.log(e));

io.on("connection", socket => {
        console.log("user connected");
      
        
        socket.on('ack',({room,user})=>{
            socket.join(room,()=>{
                socket.room=room;
                if (numClients[room] == undefined) {
                    numClients[room] = 1;
                    clients[room]=[];
                    clients[room].push(user);
                } else if(numClients[room]==0) {
                    numClients[room] = 1;
                    clients[room]=[];
                    clients[room].push(user);
                }else{
                    numClients[room]++;
                    if(!clients[room].includes(user))
                    clients[room].push(user);
                }
                socket.on('disconnect',()=>{
                    numClients[socket.room]--;
                    if(clients[socket.room])
                    clients[socket.room]=clients[socket.room].filter(val=>val!=user)
                })
                io.in(room).emit('ackback',{num:numClients[room],present:clients[room][0]});

            })
        })
    
    });

app.get('server').listen(3001,()=>{
    console.log('chat server started');
});