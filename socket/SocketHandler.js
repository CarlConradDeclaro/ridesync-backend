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



