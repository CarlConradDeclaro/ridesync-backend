import express from 'express'
import cors from 'cors'
import { createServer, Server } from 'http'
import { Server as IO } from 'socket.io'
import dotenv from 'dotenv'
import userRoute from './Routes/userRoutes.js'
import driverRoute from './Routes/driverRoutes.js'
import { initSocket } from './config/socket.js'


dotenv.config()
const app = express();
const server = createServer(app)



app.use(express.json())
// app.use(cors({//
//     origin: ['http://localhost:5173','http://192.168.0.184:5173','https://delicate-churros-85e0d1.netlify.app'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     // credentials: true // If you need to include credentials in requests
// }));
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://192.168.0.184:5173',
        'https://ridesync.netlify.app',
        'https://05f9-131-226-110-74.ngrok-free.app' // Add Ngrok URL
    ], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.get('/', (req, res) => {
    res.send("Welcom to ridesync")
})

app.use("/api/users", userRoute)
app.use("/api/drivers", driverRoute)

const io = new IO(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            'http://192.168.0.184:5173',
            'https://ridesync.netlify.app',
            'https://05f9-131-226-110-74.ngrok-free.app'
        ],
        methods: ["GET", "POST"],
    },
})

initSocket(io)

const port = process.env.PORT || 5000

server.listen(port, '0.0.0.0', (req, res) => {
    console.log(`Server running on PORT: ${port}`);
})
