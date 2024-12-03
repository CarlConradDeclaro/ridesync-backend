import connection from '../../Database/Connection/Connection.js';
import { routeSchema } from '../../models/routeSchema.js';


const getRouteRequest = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const query = `
        SELECT * FROM Routes
        WHERE userId = ? AND status = 'pending' 
    `;

    try {
        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error fetching routes." });
            }


            res.json(results); // Return the fetched routes
        });
    } catch (error) {
        console.error("Error fetching routes:", error);
        res.status(500).json({ message: "Server error." });
    }
};

const getRequestRide = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const query = `
        SELECT * FROM Routes
        WHERE userId = ? AND status = 'onGoing' 
    `;

    try {
        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error fetching routes." });
            }


            res.json(results); // Return the fetched routes
        });
    } catch (error) {
        console.error("Error fetching routes:", error);
        res.status(500).json({ message: "Server error." });
    }
};

const getRecentRide = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    // const query = `
    //    SELECT  r.routeId,r.userId, r.startLocation,r.endLocation, r.estimatedDuration, r.distance, r.totalAmount,
    //     r.startLatitude, r.startLongitude,r.endLatitude,r.endLongitude,r.status,
    //       d.userFn,d.userLn,d.userRating,d.userEmail,d.userPhone,v.vehiclePlateNo,v.vehicleColor
    //     FROM 
    //         Rides AS rd
    //     INNER JOIN 
    //         Routes AS r ON rd.routeId = r.routeId
    //     INNER JOIN
    //         Users AS u  On u.userId = r.userId 
    //     JOIN Users AS d ON d.userId = rd.driverId  
    //     JOIN Vehicle AS v ON v.userId = rd.driverId
    //     WHERE 
    //         r.status != 'booking' AND r.status != 'Cancelled' and rd.routeId = r.routeId AND r.userId = ?;
    //             `;
//     const query  =`
//     SELECT  
//     r.routeId,
//     r.userId,
//     r.startLocation,
//     r.endLocation,
//     r.estimatedDuration,
//     r.distance,
//     r.totalAmount,
//     r.startLatitude,
//     r.startLongitude,
//     r.endLatitude,
//     r.endLongitude,
//     r.status,
//     d.userFn,
//     d.userLn,
//     d.userRating,
//     d.userEmail,
//     d.userPhone,
//     v.vehiclePlateNo,
//     v.vehicleColor,
//     b.routeId AS bookingRouteId  -- Add booking route ID to get routes from Booking table
// FROM 
//     Routes AS r
// INNER JOIN 
//     Users AS u ON u.userId = r.userId  -- User who created the route
// LEFT JOIN 
//     Rides AS rd ON rd.routeId = r.routeId  -- Include rides for the route
// LEFT JOIN 
//     Users AS d ON d.userId = rd.driverId  -- Driver info for the ride
// LEFT JOIN 
//     Vehicle AS v ON v.userId = rd.driverId  -- Vehicle info for the ride
// LEFT JOIN 
//     Booking AS b ON b.routeId = r.routeId  -- Include routes based on booking
// WHERE 
//     r.status != 'booking' AND r.status != 'Cancelled'
//     AND r.userId = ?;  -- Get routes for the passenger (user with ID 30)

//     `
    const  query =` 
    
 SELECT  
    r.routeId,
    r.userId,
    r.startLocation,
    r.endLocation,
    r.estimatedDuration,
    r.distance,
    r.totalAmount,
    r.startLatitude,
    r.startLongitude,
    r.endLatitude,
    r.endLongitude,
    r.status,
    COALESCE(b.driverId,rd.driverId, 'No UserId') AS driverId,
    COALESCE(d.userFn, dd.userFn, 'No Driver') AS userFn,  -- Use dd if d is null
    COALESCE(d.userLn, dd.userLn, 'No Last Name') AS userLn,  -- Use dd if d is null
    COALESCE(d.userRating, dd.userRating, 0) AS userRating,  -- Use dd if d is null
    COALESCE(d.userEmail, dd.userEmail, 'No Email') AS userEmail,  -- Use dd if d is null
    COALESCE(d.userPhone, dd.userPhone, 'No Phone') AS userPhone,  -- Use dd if d is null
    COALESCE(v.vehiclePlateNo, vv.vehiclePlateNo, 'No Plate') AS vehiclePlateNo,  -- Use vv if v is null
    COALESCE(v.vehicleColor, vv.vehicleColor, 'No Color') AS vehicleColor,  -- Use vv if v is null
    
    b.routeId AS bookingRouteId  -- Add booking route ID to get routes from Booking table
FROM 
    Routes AS r
LEFT JOIN 
    Booking AS b ON b.routeId = r.routeId  -- Include routes based on booking
INNER JOIN 
    Users AS u ON u.userId = r.userId  -- User who created the route
LEFT JOIN 
    Rides AS rd ON rd.routeId = r.routeId  -- Include rides for the route
LEFT JOIN 
    Users AS d ON d.userId = rd.driverId  
LEFT JOIN 
    Users AS dd ON dd.userId = b.driverId    
LEFT JOIN 
    Vehicle AS v ON v.userId = rd.driverId  -- Vehicle info for the driver in the ride
LEFT JOIN 
    Vehicle AS vv ON vv.userId = b.driverId  -- Vehicle info for the driver in the booking
WHERE 
    r.status != 'booking' AND r.status != 'Cancelled'
    AND r.userId = ?;  -- Get routes for the passenger (user with ID 30)


    `

    try {
        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error fetching routes." });
            }


            res.json(results); // Return the fetched routes
        });
    } catch (error) {
        console.error("Error fetching routes:", error);
        res.status(500).json({ message: "Server error." });
    }
};


const RouteRequest = async (req, res) => {
    const { userId, startLocation, startLatitude, startLongitude, endLocation, endLatitude, endLongitude, estimatedDuration, distance, totalAmount } = req.body;

    try {
        const { error } = routeSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message })

        const query = `
             INSERT INTO Routes (userId, startLocation,startLatitude,startLongitude, endLocation,endLatitude,endLongitude, estimatedDuration, distance, totalAmount )
             VALUES (?,?,?,?,?,?,?,?,?,?)
        `
        const result = await new Promise((resolve, reject) => {
            connection.query(query, [userId, startLocation, startLatitude, startLongitude, endLocation, endLatitude, endLongitude, estimatedDuration, distance, totalAmount], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });


        if (result.affectedRows > 0)
            res.status(200).json({ message: "Route added successfully", routeId: result.insertId });
        else
            res.status(400).json({ message: "Failed to add route" });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
}

const RouteCancelled = async (req, res) => {
    const { userId, yourDriver } = req.body;

    try {
        // Update Routes and PotentialDrivers first
        const query = `
            UPDATE Routes
            SET status = 'Cancelled'
            WHERE userId = ? AND (status = 'onGoing' OR status = 'pending')
        `;
        const query2 = `
            UPDATE PotentialDrivers
            SET status = 'cancelled'
            WHERE passengerId = ? AND (status = 'waiting' OR status = 'matched')
        `;

        await new Promise((resolve, reject) => {
            connection.query(query, [userId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        await new Promise((resolve, reject) => {
            connection.query(query2, [userId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        // Fetch the last cancelled routeId for the user
        const getRouteQuery = `
            SELECT routeId
            FROM Routes
            WHERE status = 'Cancelled' AND userId = ?
            ORDER BY routeId DESC
            LIMIT 1
        `;

        const lastCancelledRoute = await new Promise((resolve, reject) => {
            connection.query(getRouteQuery, [userId], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]?.routeId); // Get the routeId or undefined if no result
            });
        });

        if (!lastCancelledRoute) {
            return res.status(404).json({ message: "No cancelled route found for the user" });
        }

        // Update Rides with the fetched routeId
        const query3 = `
            UPDATE Rides
            SET rideStatus = 'cancelled'
            WHERE routeId = ? AND (rideStatus = 'pending' OR rideStatus = 'matched' OR rideStatus = 'onGoing')
        `;

        const result = await new Promise((resolve, reject) => {
            connection.query(query3, [lastCancelledRoute], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (result.affectedRows > 0)
            res.status(200).json({ message: "Route updated successfully" });
        else
            res.status(400).json({ message: "Failed to update" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};




const getCancelledRoutes = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const query = `
        SELECT * FROM Routes
        WHERE userId = ? AND status = 'Cancelled' 
    `;

    try {
        connection.query(query, [userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error fetching routes." });
            }


            res.json(results); // Return the fetched routes
        });
    } catch (error) {
        console.error("Error fetching routes:", error);
        res.status(500).json({ message: "Server error." });
    }
}

const updateRoutesToCompleted = async (req, res) => {
    const { driverId } = req.body;
    if (!driverId) return res.status(400).json({ message: "User ID is required." });

    const query1 = `
       SELECT routeId FROM Rides WHERE driverId = ? AND rideStatus = 'onGoing'
    `;
    const query2 = `
       UPDATE Rides SET rideStatus = 'Completed' WHERE driverId = ? AND rideStatus = 'onGoing'
    `;
    const query3 = `
       UPDATE Routes SET status = 'Completed' WHERE routeId = ?
    `;
    const query4 = `
       UPDATE PotentialDrivers SET status = 'Completed' WHERE driverId = ? AND status = 'matched'
    `;

    try {
        // Step 1: Fetch the routeId from Rides where driverId is provided and rideStatus is onGoing
        connection.query(query1, [driverId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error fetching route." });
            }

            if (results.length === 0 || !results[0].routeId) {
                return res.status(404).json({ message: "No ongoing rides found for the driver." });
            }

            const routeId = results[0].routeId;

            // Step 2: Update the Rides table to set rideStatus as 'Completed'
            connection.query(query2, [driverId], (err) => {
                if (err) {
                    console.error("Error updating ride status:", err);
                    return res.status(500).json({ message: "Error updating ride status." });
                }

                // Step 3: Update the Routes table to set status as 'Completed' for the corresponding routeId
                connection.query(query3, [routeId], (err) => {
                    if (err) {
                        console.error("Error updating route status:", err);
                        return res.status(500).json({ message: "Error updating route status." });
                    }

                    // Step 4: Update the PotentialDrivers table to mark the driver as unavailable
                    connection.query(query4, [driverId], (err) => {
                        if (err) {
                            console.error("Error updating driver status:", err);
                            return res.status(500).json({ message: "Error updating driver status." });
                        }

                        // If everything goes successfully
                        console.log("All updates completed successfully.");
                        return res.status(200).json({ message: "Ride and related records updated successfully." });
                    });
                });
            });
        });
    } catch (error) {
        console.error("Error completing the ride:", error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
};


const rateUser = (req, res) => {
    const { user_id, rating } = req.body;

    if (!user_id || !rating) {
        return res.status(400).json({ error: 'user_id and rating are required.' });
    }

    const insertRatingQuery = `INSERT INTO Ratings (user_id, rating) VALUES (?, ?)`;
    connection.query(insertRatingQuery, [user_id, rating], (err, result) => {
        if (err) {
            console.error('Error inserting rating:', err);
            return res.status(500).json({ error: 'Failed to add rating.' });
        }

        const updateUserRatingQuery = `
            UPDATE Users u
            JOIN (
                SELECT 
                    user_id,
                    ROUND(AVG(CAST(rating AS DECIMAL(10, 2))), 2) AS average_rating
                FROM 
                    Ratings
                GROUP BY 
                    user_id
            ) r ON u.userId = r.user_id
            SET u.userRating = r.average_rating;
        `;

        connection.query(updateUserRatingQuery, (err, result) => {
            if (err) {
                console.error('Error updating user rating:', err);
                return res.status(500).json({ error: 'Failed to update user rating.' });
            }

            return res.status(200).json({ message: 'Rating added and user rating updated successfully.' });
        });
    });
};
 

export { rateUser,RouteRequest, RouteCancelled, getRouteRequest, getRequestRide, getCancelledRoutes, updateRoutesToCompleted, getRecentRide }