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




export { RouteRequest, RouteCancelled, getRouteRequest, getRequestRide }