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
            res.status(200).json({ message: "potential Drivers added successfully", status: true });
        else
            res.status(400).json({ message: "Failed to add" });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
}




export { PotentialRide }