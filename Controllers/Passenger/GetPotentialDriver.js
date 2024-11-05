import connection from "../../Database/Connection/Connection.js";

const GetAllPotentialRide = async (req, res) => {
    const { userId } = req.body
    const query = `
    SELECT * FROM  PotentialDrivers
    WHERE passengerId = ? AND status = "pending"
`;
    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: 'error fetching data' })
        } else {
            res.json(results)
        }
    })
}


const CancelledAllPotentialDrivers = async (req, res) => {
    const { driversIds } = req.body;

    if (!driversIds || driversIds.length === 0) {
        return res.status(400).json({ message: "No driver IDs provided." });
    }

    const query = `
        UPDATE PotentialDrivers
        SET status = 'Cancelled'
        WHERE driverId IN (?) AND status = 'pending'
    `;

    try {
        const result = await new Promise((resolve, reject) => {
            connection.query(query, [driversIds], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Drivers cancelled successfully." });
        } else {
            res.status(400).json({ message: "No drivers found with pending status." });
        }
    } catch (error) {
        console.error("Error cancelling drivers:", error);
        res.status(500).json({ message: "Server error." });
    }
};



export { GetAllPotentialRide, CancelledAllPotentialDrivers }