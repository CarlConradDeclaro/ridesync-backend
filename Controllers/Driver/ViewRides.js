import connection from "../../Database/Connection/Connection.js";

const getRecentRides = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const query = `
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
            u.userFn, 
            u.userLn, 
            u.userRating, 
            u.userEmail, 
            u.userPhone,
            rd.routeId AS rideRouteId,
            b.routeId AS bookingRouteId
        FROM 
            Routes AS r
        LEFT JOIN 
            Rides AS rd ON rd.routeId = r.routeId AND rd.driverId = ?
        INNER JOIN 
            Users AS u ON u.userId = r.userId
        LEFT JOIN 
            Booking AS b ON b.routeId = r.routeId AND b.driverId = ?
        WHERE 
            r.status NOT IN ('booking', 'Cancelled') 
            AND (rd.routeId IS NOT NULL OR b.routeId IS NOT NULL)
            AND (rd.driverId IS NULL OR rd.driverId = ?);
        `

    try {
        connection.query(query, [userId,userId,userId], (err, results) => {
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
          SELECT 
                r.routeId,r.userId,r.startLocation,r.endLocation,r.estimatedDuration,r.distance,
                r.totalAmount,r.startLatitude,r.startLongitude,r.endLatitude,r.endLongitude,
                b.driverId,b.trip,b.numPassengers,b.rideType,b.travelDate,d.userFn,d.userLn,
                d.userEmail,d.userPhone,d.userRating
          FROM  Routes AS r
          JOIN  Booking AS b ON r.routeId = b.routeId	
          JOIN Users as d ON d.userId = b.userId
          JOIN Users AS u On u.userId = b.driverId
          WHERE b.status = 'booking' AND u.userType = 'D' AND u.userId = ?
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

const getCancelledRides = async(req,res)=>{
    const {userId} = req.body;
    const query = `
        SELECT * 
        FROM Routes as r
        JOIN Booking as b On b.routeId = r.routeId
        WHERE b.driverId = ? AND r.status = 'cancelled';
    `

    try {
        const result = await new Promise((resolve,reject)=>{
            connection.query(query,[userId],(err,results)=>{
                if(err)return reject(results)
                resolve(results)                    
            })
        })
           // Check if there are results and send the response
           if (result.length > 0) {
            res.json(result);  // Send the results back to the client
        } else {
            res.status(404).json({ message: "No cancelled rides found." });
        }
       
    } catch (error) {
        console.error("Error fetching routes:", error);
        res.status(500).json({ message: "Server error." });
    }
}

export { getRecentRides, getBookingRides,getCancelledRides }