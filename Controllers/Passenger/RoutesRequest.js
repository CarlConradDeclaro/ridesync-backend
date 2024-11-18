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

    const query = `
       SELECT  r.routeId,r.userId, r.startLocation,r.endLocation, r.estimatedDuration, r.distance, r.totalAmount,
        r.startLatitude, r.startLongitude,r.endLatitude,r.endLongitude,r.status,
        u.userFn,u.userLn,u.userRating,u.userEmail,u.userPhone
        FROM 
            Rides AS rd
        INNER JOIN 
            Routes AS r ON rd.routeId = r.routeId
        INNER JOIN
            Users AS u  On u.userId = r.userId   
        WHERE 
            r.status != 'booking' AND r.status != 'Cancelled' and rd.routeId = r.routeId AND r.userId = ?;
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
        const query = `
            UPDATE Routes
            SET status = 'Cancelled'
            WHERE  userId = ? AND status = 'onGoing'  OR status = "pending"
        `
        const query2 = `
        UPDATE PotentialDrivers
        SET status = 'cancelled'
        WHERE passengerId = ? AND status = "waiting" || status = "matched"
    `;
        const query3 = `
            UPDATE Rides
            SET rideStatus = 'cancelled'
            WHERE driverId = ? AND rideStatus = "pending" || rideStatus = "matched"  || rideStatus = "onGoing" 
        `;

        const result = await new Promise((resolve, reject) => {
            connection.query(query, [userId], (err, results) => {
                if (err) return reject(err)
                resolve(results)
            })
            connection.query(query2, [userId], (err, results) => {
                if (err) return reject(err)
                resolve(results)
            })
            connection.query(query3, [yourDriver], (err, results) => {
                if (err) return reject(err)
                resolve(results)
            })
        })

        if (result.affectedRows > 0)
            res.status(200).json({ message: "Route updated successfully" })
        else
            res.status(400).json({ message: 'Failed to update' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' })
    }
}


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




export { RouteRequest, RouteCancelled, getRouteRequest, getRequestRide, getCancelledRoutes, updateRoutesToCompleted, getRecentRide }