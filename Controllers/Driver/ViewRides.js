import connection from "../../Database/Connection/Connection.js";

const getRecentRides = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const query = `
            SELECT  r.routeId, r.userId, r.startLocation,r.endLocation,r.estimatedDuration, r.distance,
            r.totalAmount, r.startLatitude,r.startLongitude,r.endLatitude, r.endLongitude, r.status,
            u.userFn, u.userLn, u.userRating, u.userEmail, u.userPhone , r.totalAmount , r.estimatedDuration,r.distance
            FROM 
                Rides AS rd
            INNER JOIN 
                Routes AS r ON rd.routeId = r.routeId
            INNER JOIN
                Users AS u  On u.userId = r.userId   
            WHERE 
                r.status != 'booking' AND r.status != 'Cancelled' AND rd.driverId = ?;
        `

    try {
        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error fetching routes." });
            }
            res.json(results);
        })
    } catch (error) {
        console.error("Error fetching routes:", error);
        res.status(500).json({ message: "Server error." });
    }
}


const getBookingRides = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }
    const query = `
         SELECT r.routeId,r.userId, r.startLocation, r.endLocation, r.estimatedDuration,r.distance,r.totalAmount,
                r.startLatitude,r.startLongitude,r.endLatitude,r.endLongitude,b.driverId,b.trip, b.numPassengers,
                b.rideType,b.travelDate,u.userFn, u.userLn,u.userRating, u.userEmail
                FROM Booking AS b 
                JOIN  Routes AS r  ON r.routeId = b.routeId
                JOIN Users AS u on r.userId = u.userId
                WHERE 
                r.status = 'booking' AND b.driverId = 12;
                 `

    try {
        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error fetching routes." });
            }
            res.json(results);
        })
    } catch (error) {
        console.error("Error fetching routes:", error);
        res.status(500).json({ message: "Server error." });
    }
}

export { getRecentRides, getBookingRides }