import { addNewUser, handelCarpoolingBooking, handleAcceptRide, handleCancelRide, handleDriverArrived, handleDriverComming, handleMessageSendTo, handleOfferRide, handleRefresh, handleRefreshRides, handleTransactionCompleted } from "../socket/SocketHandler.js";

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
            console.log("cancelld");

        });

        // Handle offer ride
        socket.on("offerRide", (userId, driverId) => {
            handleOfferRide(io, socket, userId, driverId);
        });

        socket.on("passenger", (passengerId, driverId) => {
            console.log("your passenger is ", passengerId);
            //    io.emit("yourPassenger", passengerId)
            handleAcceptRide(io, socket, passengerId, driverId)

        })

        socket.on("cancelledRide", (userId, driverId) => {
            console.log("your about to be cancelled", driverId);

            handleCancelRide(io, socket, userId, driverId)
        })

        socket.on("driverIsOtw", (passengerId, latitude, longitude) => {
            handleDriverComming(io, socket, passengerId, latitude, longitude)
        })
        socket.on("driverArrivedAtPickUpLoc", (passengerId) => {
            handleDriverArrived(io, socket, passengerId)
        })

        socket.on("transactionCompleted", (passengerId) => {
            handleTransactionCompleted(io, socket, passengerId)
        })

        socket.on("sendMessageTo", (userId, message, driverId) => {
            handleMessageSendTo(io, socket, userId, message, driverId)
        })

        socket.on("carpoolBooking",(routeId,passengerId,driverId,numberOfPassengers)=>{
            handelCarpoolingBooking(io,routeId,passengerId,driverId,numberOfPassengers)
        })

        socket.on("refreshViewRides",(userId,routeId)=>{
            handleRefreshRides(io,userId,routeId)
        })
        socket.on("refresh",(userId,routeId)=>{
            handleRefresh(io,userId,routeId)
        })

        // Handle disconnect
        socket.on("disconnect", () => {
            console.log("Disconnected", socket.id);
            // Remove user from onlineUsers on disconnect
            onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
            io.emit("getOnlineUsers", onlineUsers);
        });
    });
};
