import express from 'express'
import cors from 'cors'
import { createServer, Server } from 'http'
import { Server as IO } from 'socket.io'
import dotenv from 'dotenv'
import userRoute from './Routes/userRoutes.js'
import driverRoute from './Routes/driverRoutes.js'


dotenv.config()
const app = express();
const server = createServer(app)


app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
    // credentials: true // If you need to include credentials in requests
}));




app.get('/', (req, res) => {
    res.send("Welcom to ridesync")
})



app.use("/api/users", userRoute)
app.use("/api/drivers", driverRoute)



const io = new IO(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
})


let onlineUsers = []
io.on("connection", (socket) => {
    // console.log("New Connection from backend:", socket.id);

    socket.on("addNewUser", (userId, socketId) => {
        const userIndex = onlineUsers.findIndex(user => user.userId === userId);

        if (userIndex === -1) {
            onlineUsers.push({ userId, socketId });
        } else {
            // Update existing user's socket ID
            onlineUsers[userIndex].socketId = socketId;
        }


        console.log("onlineUsers", onlineUsers);
        io.emit("getOnlineUsers", onlineUsers);
    })

    socket.on("newRouteData", (newData) => {
        io.emit('getNewRouteData', newData)
    })

    socket.on("cancelled", (id) => {
        io.emit('getCancelledRequest', id)
    })

    socket.on("offerRide", (userId, driverId) => {
        const targetUser = onlineUsers.find(user => user.userId === userId);

        if (targetUser) {
            socket.to(targetUser.socketId).emit("yourDriver", driverId);
            console.log("Driver ID sent to user:", driverId);
        } else {
            console.log(`User with ID ${userId} is not online.`);
        }
    });
    socket.on("disconnect", () => {
        console.log("Disconnected", socket.id);
        // Remove user from onlineUsers on disconnect
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });
})


const port = process.env.PORT || 5000

server.listen(port, (req, res) => {
    console.log(`Server running on PORT: ${port}`);
})