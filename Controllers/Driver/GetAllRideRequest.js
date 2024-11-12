import connection from "../../Database/Connection/Connection.js"

const GetAllRideRequest = (req, res) => {

    connection.query('SELECT * FROM Routes WHERE status = "pending"', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: 'error fetching data' })
        } else {
            res.json(results)
        }
    })

}


const GetOnGoingRoute = (req, res) => {


    const { routeId } = req.body;

    const query = `
    SELECT * FROM Routes WHERE routeId = ? AND status = "onGoing"
    `

    connection.query(query, [routeId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: 'error fetching data' })
        } else {
            res.json(results)
        }
    })

}


export { GetAllRideRequest, GetOnGoingRoute }