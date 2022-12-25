const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
app.use(cors());
const {Server} = require('socket.io')

require('dotenv').config()

const port = process.env.PORT

const server = http.createServer()

const io = new Server(server, {
  cors:{
    origin:"http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket)=>{
  console.log('User connected: ',socket.id, '\n')

  socket.on("join_room", (data)=>{
    socket.join(data)
    console.log(`User with ID: ${socket.id} joined room with id: ${data}`)
  })

  socket.on("send_message", data=>{
    console.log(data)
    socket.to(data.room).emit("receive_message",data)
  })

  // add event to disconnect at the end of event
  socket.on("disconnect", ()=>{
    console.log('User disconnected: ',socket.id, '\n')
  })
})

server.listen(port, ()=>{
  console.log('SERVER RUNNING ON PORT', port)
})