import connection from "../Database/Connection/Connection.js";


const getDriver = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const query = `
        SELECT rd.driverId 
        FROM Rides AS rd
        JOIN Routes AS r ON r.routeId = rd.routeId
        JOIN Users AS u ON u.userId = r.userId
        WHERE rd.rideStatus = 'onGoing' AND u.userId = ?;
    `;

    try {
        const results = await new Promise((resolve, reject) => {
            connection.query(query, [userId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });

        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json({ message: "No ongoing rides found for this user." });
        }
    } catch (error) {
        console.error("Error fetching driver:", error);
        res.status(500).json({ message: "Server error.", error });
    }
};


const checkIfChatExists = (user1_Id, user2_Id) => {
    const checkQuery = `
        SELECT * FROM Chats 
        WHERE 
            (user1_Id = ? AND user2_Id = ?) 
            OR (user1_Id = ? AND user2_Id = ?) -- Check both directions
    `;

    return new Promise((resolve, reject) => {
        connection.query(checkQuery, [user1_Id, user2_Id, user2_Id, user1_Id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results.length > 0); // Return true if chat exists
        });
    });
};

const createChats = async (req, res) => {
    const { user1_Id, user2_Id } = req.body;

    if (!user1_Id || !user2_Id) {
        return res.status(400).json({ message: "Users ID is required." });
    }

    try {
        // Check if chat already exists
        const chatExists = await checkIfChatExists(user1_Id, user2_Id);

        if (chatExists) {
            return res.status(409).json({ message: "Chat already exists", status: false }); // Conflict response
        }

        // Insert new chat if it doesn't exist
        const insertQuery = `
            INSERT INTO Chats (user1_Id, user2_Id) VALUES (?, ?)
        `;

        const results = await new Promise((resolve, reject) => {
            connection.query(insertQuery, [user1_Id, user2_Id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (results.affectedRows > 0) {
            res.status(201).json({ message: "Chat created successfully", status: true }); // Created response
        } else {
            res.status(201).json({ message: "Failed to create chat", status: false });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

const getChats = async (req, res) => {
    const { userId, requestFrom } = req.body;
    const queryPassenger = `
        SELECT  c.chatId, c.user2_Id,
            u.userFn,u.userLn
            FROM Chats AS c
            JOIN Users AS u ON u.userId = c.user2_Id
            WHERE c.user1_Id = ?
    `

    const queryDriver = `
        SELECT  c.chatId, c.user1_Id,
                u.userFn,u.userLn
        FROM Chats AS c
        JOIN Users AS u ON u.userId = c.user1_Id
        WHERE c.user2_Id = ?
        `
    let query;

    if (requestFrom == 'passenger') {
        query = queryPassenger;
    } else if (requestFrom == 'driver') {
        query = queryDriver
    }

    try {
        const results = await new Promise((resolve, reject) => {
            connection.query(query, [userId], (err, results) => {
                if (err) return reject(err)
                resolve(results)
            })
        })
        if (results.length > 0)
            res.status(200).json(results)
        else
            res.status(404).json({ message: "No chats" });
    } catch (error) {
        console.error("Error fetching driver:", error);
        res.status(500).json({ message: "Server error.", error });
    }
}


const sendMessage = async (req, res) => {
    const { chatId, userId, message } = req.body;

    const query = `
    INSERT INTO Messages (chatId, sender_Id, message, timeSend)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
 `;

    try {
        const results = await new Promise((resolve, reject) => {
            connection.query(query, [chatId, userId, message], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (results.affectedRows > 0) {
            res.status(201).json({ message: "message insert successfully", status: true }); // Created response
        } else {
            res.status(400).json({ message: "Failed to insert message" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
}


const getMessages = async (req, res) => {
    const { chatId } = req.body;
    const query = `
      SELECT sender_Id,message, timeSend
        FROM Messages 
        WHERE chatId = ?;
    `
    try {
        const results = await new Promise((resolve, reject) => {
            connection.query(query, [chatId], (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });

        if (results.length > 0) {
            res.status(200).json(results);
        } else {
            res.status(404).json({ message: "No messsage found for this user." });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
}


const checkChatExist = async(req,res)=>{
    
}


export { getDriver, createChats, getChats, sendMessage, getMessages }