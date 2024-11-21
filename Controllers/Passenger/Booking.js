import { query } from "express";
import connection from "../../Database/Connection/Connection.js";

const Booking = async (req, res) => {
    const { userId, startLocation, startLatitude, startLongitude, endLocation, endLatitude, endLongitude,
        estimatedDuration, distance, totalAmount, driverId, trip, numPassengers, rideType, travelDate, status } = req.body;

    try {
        const query = `
            INSERT INTO Routes (userId, startLocation, startLatitude, startLongitude, endLocation, endLatitude, endLongitude, estimatedDuration, distance, totalAmount,status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
        `;
        const result = await new Promise((resolve, reject) => {
            connection.query(query, [userId, startLocation, startLatitude, startLongitude, endLocation, endLatitude, endLongitude, estimatedDuration, distance, totalAmount, status], (err, results) => {
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

const getBookings = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const query = `
          SELECT 
                r.routeId,r.userId,r.startLocation,r.endLocation,r.estimatedDuration,r.distance,
                r.totalAmount,r.startLatitude,r.startLongitude,r.endLatitude,r.endLongitude,
                b.driverId,b.trip,b.numPassengers,b.rideType,b.travelDate,u.userFn,u.userLn,
                u.userEmail,u.userPhone,u.userRating
          FROM  Routes AS r
          JOIN  Booking AS b ON r.routeId = b.routeId
          JOIN Users AS u On u.userId = b.userId
          WHERE r.status = 'booking' AND u.userType = 'P' AND u.userId = ?
        `


    try {
        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error fetching routes." });
            }

            res.json(results)
        })
    } catch (error) {
        console.error("Error fetching routes:", error);
        res.status(500).json({ message: "Server error." });
    }
}


export { Booking, getBookings };
