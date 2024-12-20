import connection from "../../Database/Connection/Connection.js";


const PotentialRide = async (req, res) => {
    const { driverId, passengerId } = req.body;
    console.log("Received data:", req.body);
    const query = `
    INSERT INTO PotentialDrivers ( driverId,passengerId)
    VALUES (?,?)`

    try {
        const result = await new Promise((resolve, reject) => {
            connection.query(query, [driverId, passengerId], (err, results) => {
                if (err) return reject(err)
                resolve(results)
            })
        })
        if (result.affectedRows > 0)
            res.status(200).json({ status:true});
        else
            res.status(400).json({ message: "Failed to add" });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
}



const Ride = async (req, res) => {


    const { driverId, routeId, } = req.body;
    console.log("Received data:", req.body)

    const query = `
       INSERT INTO Rides(driverId,routeId)
       VALUES(?,?)
    `

    try {
        const result = await new Promise((resolve, reject) => {
            connection.query(query, [driverId, routeId], (err, results) => {
                if (err) return reject(err)
                resolve(results)
            })
        })

        if (result.affectedRows > 0)
            res.status(200).json({ message: "potential Drivers added successfully", status: true });
        else
            res.status(400).json({ message: "Failed to add" });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }

}
const getRides = async (req, res) => {
    const { driverId, status } = req.body;

    if (!driverId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const query = `
        SELECT * FROM Rides
        WHERE driverId = ? AND rideStatus = ?
    `;

    try {
        connection.query(query, [driverId, status], (err, results) => {
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


const fetchIfDriverOfferingRide = async (req, res) => {
    const { driverId } = req.body
    if (!driverId) {
        return res.status(400).json({ message: "User ID is required." });
    }
    const query = `
       SElECT * FROM PotentialDrivers
       WHERE driverId = ? and status = 'waiting'
    `
    try {
        connection.query(query, [driverId], (err, results) => {
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



export { PotentialRide, Ride, getRides, fetchIfDriverOfferingRide }