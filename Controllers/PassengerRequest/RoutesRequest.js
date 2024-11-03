import Joi from 'joi'
import connection from '../../Database/Connection/Connection.js';


const routeSchema = Joi.object({
    userId: Joi.number().required(),
    startLocation: Joi.string().required(),
    endLocation: Joi.string().required(),
    estimatedDuration: Joi.number().required(),
    distance: Joi.number().required(),
    totalAmount: Joi.number().required(),
    startLatitude: Joi.number().required(),
    startLongitude: Joi.number().required(),
    endLatitude: Joi.number().required(),
    endLongitude: Joi.number().required()
});


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




export { RouteRequest, RouteCancelled }