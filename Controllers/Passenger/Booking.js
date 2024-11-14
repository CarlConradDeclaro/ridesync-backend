import connection from "../../Database/Connection/Connection.js";

const Booking = async (req, res) => {
    const { userId, startLocation, startLatitude, startLongitude, endLocation, endLatitude, endLongitude,
        estimatedDuration, distance, totalAmount, driverId, trip, numPassengers, rideType, travelDate, status } = req.body;

    try {
        const query = `
            INSERT INTO Routes (userId, startLocation, startLatitude, startLongitude, endLocation, endLatitude, endLongitude, estimatedDuration, distance, totalAmount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await new Promise((resolve, reject) => {
            connection.query(query, [userId, startLocation, startLatitude, startLongitude, endLocation, endLatitude, endLongitude, estimatedDuration, distance, totalAmount], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const routeId = result.insertId;

        const query1 = `
            INSERT INTO Booking (userId, driverId, routeId, trip, numPassengers, rideType, travelDate, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result2 = await new Promise((resolve, reject) => {
            connection.query(query1, [userId, driverId, routeId, trip, numPassengers, rideType, travelDate, status], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (result.affectedRows > 0 && result2.affectedRows > 0) {
            res.status(200).json({ message: "Booking successful", routeId });
        } else {
            res.status(400).json({ message: "Failed to complete booking" });
        }

    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export { Booking };
