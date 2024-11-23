let onlineUsers = [];



export const addNewUser = (io, socket, userId, socketId) => {
    const userIndex = onlineUsers.findIndex(user => user.userId === userId);

    if (userIndex === -1) {
        onlineUsers.push({ userId, socketId });
    } else {
        // Update existing user's socket ID
        onlineUsers[userIndex].socketId = socketId;
    }

    console.log("onlineUsers", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
};


export const handleOfferRide = (io, socket, userId, driverId) => {
    const targetUser = onlineUsers.find(user => user.userId === userId);

    if (targetUser) {
        io.to(targetUser.socketId).emit("yourDriver", driverId);
        console.log("Driver ID sent to user:", driverId);
    } else {
        console.log(`User with ID ${userId} is not online.`);
    }
};

export const handleAcceptRide = (io, socket, userId, driverId) => {
    const targetUser = onlineUsers.find(user => user.userId === driverId);

    if (targetUser) {
        io.to(targetUser.socketId).emit("yourPassenger", userId);
        console.log("Driver ID sent to user:", userId);
    } else {
        console.log(`User with ID ${driverId} is not online.`);
    }
};

export const handleCancelRide = (io, socket, userId, driverId) => {
    const targetUser = onlineUsers.find(user => user.userId === driverId);

    if (targetUser) {
        io.to(targetUser.socketId).emit("cancelledRide", userId);
        console.log("Driver ID sent to user:", userId);
    } else {
        console.log(`User with ID ${driverId} is not online.`);
    }
};

export const handleDriverComming = (io, socket, userId, latitude, longitude) => {
    const targetUser = onlineUsers.find(user => user.userId === userId);

    if (targetUser) {
        io.to(targetUser.socketId).emit("driverIsComming", latitude, longitude);
        console.log("driverIsOnTheWay");
    } else {
        console.log(`User with ID ${userId} is not online.`);
    }
};
export const handleDriverArrived = (io, socket, userId) => {
    const targetUser = onlineUsers.find(user => user.userId === userId);

    if (targetUser) {
        io.to(targetUser.socketId).emit("driverHasArrived", userId);
        console.log("driverHasArrived");
    } else {
        console.log(`User with ID ${driverId} is not online.`);
    }
};

export const handleTransactionCompleted = (io, socket, userId) => {
    const targetUser = onlineUsers.find(user => user.userId === userId);

    if (targetUser) {
        io.to(targetUser.socketId).emit("rideIsCompleted", userId);
    } else {
        console.log(`User with ID ${userId} is not online.`);
    }
};

export const handleMessageSendTo = (io, socket, userId, message, driverId) => {
    const targetUser = onlineUsers.find(user => user.userId === driverId);

    if (targetUser) {
        io.to(targetUser.socketId).emit("message", userId, message, driverId);
    } else {
        console.log(`User with ID ${userId} is not online.`);
    }
};




