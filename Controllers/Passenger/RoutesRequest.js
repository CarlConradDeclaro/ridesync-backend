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

            if (results.length === 0) {
                return res.status(404).json({ message: "No routes found for this user." });
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
    const { userId } = req.body;

    try {
        const query = `
            UPDATE Routes
            SET status = 'Cancelled'
            WHERE  userId = ? AND status = 'pending'
        `

        const result = await new Promise((resolve, reject) => {
            connection.query(query, [userId], (err, results) => {
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




export { RouteRequest, RouteCancelled, getRouteRequest }