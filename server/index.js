const express = require('express')
const cors = require('cors')
require("dotenv").config()

// import package
const http = require('http')
const {Server} = require('socket.io')


// Get routes to the variabel
const router = require('./src/routes')
const app = express()
const port = 5000;

// add after app initialization
const server = http.createServer(app)
const io = new Server(server, {
 cors: {
   origin: 'http://localhost:3000' // define client origin if both client and server have different origin
 }
})
require('./src/socket')(io)

app.use(express.json());

app.use(cors());

// Add endpoint grouping and router
app.use('/api/v1/', router)
// static image view root
app.use("/uploads", express.static("uploads"))

server.listen(port, () => console.log(`Listening on port ${port}!`))
