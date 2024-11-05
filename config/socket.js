import { addNewUser, handleOfferRide } from "../socket/SocketHandler.js";

let onlineUsers = [];

export const initSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("New Connection from backend:", socket.id);

        // Add new user when they join
        socket.on("addNewUser", (userId, socketId) => {
            addNewUser(io, socket, userId, socketId);
        });

        // Handle new route data
        socket.on("newRouteData", (newData) => {
            io.emit('getNewRouteData', newData);
        });

        // Handle canceled requests
        socket.on("cancelled", (id) => {
            io.emit('getCancelledRequest', id);
        });

        // Handle offer ride
        socket.on("offerRide", (userId, driverId) => {
            handleOfferRide(io, socket, userId, driverId);
        });


        // Handle disconnect
        socket.on("disconnect", () => {
            console.log("Disconnected", socket.id);
            // Remove user from onlineUsers on disconnect
            onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
            io.emit("getOnlineUsers", onlineUsers);
        });
    });
};
