import connection from "../../Database/Connection/Connection.js";

const GetAllPotentialRide = async (req, res) => {
    const { userId, status } = req.body
    const query = `
    SELECT * FROM  PotentialDrivers
    WHERE passengerId = ? AND status = ?
`;
    connection.query(query, [userId, status], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: 'error fetching data' })
        } else {
            res.json(results)
        }
    })
}



const driverSelected = async (req, res) => {
    const { userId, driverId } = req.body;

    const query1 = `
        UPDATE PotentialDrivers
        SET status = 'rejected'
        WHERE passengerId = ? AND status = "waiting" AND driverId != ?
    `;

    const query2 = `
        UPDATE Routes
        SET status = 'onGoing'
        WHERE userId = ? AND status = "pending"
    `;
    const query3 = `
        UPDATE Rides
        SET rideStatus = 'onGoing'
        WHERE driverId = ? AND rideStatus = "pending"
        `;

    const query4 = `
        UPDATE PotentialDrivers
        SET status = 'matched'
        WHERE passengerId = ? AND status = "waiting" AND driverId = ?
    `;

    try {
        // Wrap the query in a promise to handle both asynchronously
        const updateQuery1 = new Promise((resolve, reject) => {
            connection.query(query1, [userId, driverId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const updateQuery2 = new Promise((resolve, reject) => {
            connection.query(query2, [userId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const updateQuery3 = new Promise((resolve, reject) => {
            connection.query(query3, [driverId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        const updateQuery4 = new Promise((resolve, reject) => {
            connection.query(query4, [userId, driverId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });


        // Wait for both updates to complete
        const [result1, result2] = await Promise.all([updateQuery1, updateQuery2, updateQuery3, updateQuery4]);

        res.json({ message: 'Status updated to onGoing' });
    } catch (err) {
        console.error("Error updating status:", err);
        res.status(500).send({ message: 'Error updating status in database' });
    }
};




const CancelledAllPotentialDrivers = async (req, res) => {
    const { driversIds } = req.body;

    if (!driversIds || driversIds.length === 0) {
        return res.status(400).json({ message: "No driver IDs provided." });
    }

    const query = `
        UPDATE PotentialDrivers
        SET status = 'Cancelled'
        WHERE driverId IN (?) AND status = 'pending'
    `;

    try {
        const result = await new Promise((resolve, reject) => {
            connection.query(query, [driversIds], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Drivers cancelled successfully." });
        } else {
            res.status(400).json({ message: "No drivers found with pending status." });
        }
    } catch (error) {
        console.error("Error cancelling drivers:", error);
        res.status(500).json({ message: "Server error." });
    }
};



const getRides = async (req, res) => {
    const { driverId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const query = `
        SELECT * FROM Rides
        WHERE driverId = ? AND status = 'onGoing' 
    `;

    try {
        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error fetching routes." });
            }


            res.json(results);
        });
    } catch (error) {
        console.error("Error fetching routes:", error);
        res.status(500).json({ message: "Server error." });

    }
}




export { GetAllPotentialRide, CancelledAllPotentialDrivers, driverSelected, getRides }