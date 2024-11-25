import connection from "../../Database/Connection/Connection.js";

const createCarpoolRide = async(req,res)=>{
    const {userId,rideInfo}= req.body;
    const { startLocation, endLocation,duration,distance, startLatitude,startLongitude, endLatitude,
        endLongitude, travelDateTime,NumSets,vehicle,pricePerPerson, paymentMethod, totalAmount} = rideInfo;
    
        const query = `
        INSERT INTO CarpoolRoutes (userId,startLocation, endLocation,duration,
                distance,startLatitude,startLongitude,endLatitude, endLongitude,
                travelDateTime,NumSets, vehicle,pricePerPerson, paymentMethod,
                totalAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const values = [ userId,startLocation, endLocation, duration, distance, startLatitude,
                    startLongitude,endLatitude,endLongitude,travelDateTime,NumSets,
                    vehicle,pricePerPerson,paymentMethod,totalAmount];
 
    try {
        const result = await new Promise((resolve,reject)=>{
            connection.query(query,values,(err,results)=>{
                if(err) return reject(err)
                resolve(results)
            })
        })
        if(result.affectedRows > 0){
            res.status(200).json({ message: "CarpoolRoutes Drivers added successfully",status:true})
        }else{
            res.status(400).json({message:"Failed to add"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
} 

const fetchCarpoolRide = async(req,res)=>{
    const {userId} = req.body;

    const query =`
    SELECT 
  c.routeId,
  c.userId ,
  c.startLocation,
  c.endLocation,
  c.duration,
  c.distance,
  c.startLatitude,
  c.startLongitude,
  c.endLatitude,
  c.endLongitude,
  c.travelDateTime,
  c.NumSets,
  c.vehicle,
  c.pricePerPerson,
  c.paymentMethod,
  c.status,
  c.totalAmount,
  (
    SELECT IFNULL(SUM(p.numPassengersBooked), 0)
    FROM CarpoolPassengers p
    WHERE p.driverId = c.userId AND p.carpoolRouteId = c.routeId
  ) AS totalPassengersBooked
FROM CarpoolRoutes c;
    `
    try {
        const result = await new Promise((resolve,reject)=>{
            connection.query(query,[userId],(err,results)=>{
                if(err)return reject(err)
                resolve(results)                    
            })
        })
        if(result.length > 0 ){
            res.status(200).json(result)
        }else{
            res.send({message:"Fromm backend No carpool rides found for this user"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
}

const fetchAllCarpoolRide = async(req,res)=>{
    const query =`
      SELECT * FROM CarpoolRoutes 
    `
    try {
        const result = await new Promise((resolve,reject)=>{
            connection.query(query,(err,results)=>{
                if(err)return reject(err)
                resolve(results)                    
            })
        })
        if(result.length > 0 ){
            res.status(200).json(result)
        }else{
            res.send({message:"Fromm backend No carpool rides found for this user"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
}

const countPassengers = async(req,res)=>{
    
}



const CarpoolPassenger = async(req,res)=>{
    const {passengerId,carpoolRouteId,driverId,numPassengersBooked}= req.body;

    const query = `
        INSERT INTO CarpoolPassengers (passengerId,carpoolRouteId,driverId,numPassengersBooked)
        VALUES (?,?,?,?)
    `
    try {
        const result = await new Promise((resolve,reject)=>{
            connection.query(query,[passengerId,carpoolRouteId,driverId,numPassengersBooked],(err,results)=>{
                if(err)return reject(err)
                resolve(results)
            })
        })

        if(result.affectedRows>0){
            res.status(200).json(result)
        }else{
            res.status(400).json({message:"Failed to add"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
}

const isBookedAlready = async(req,res)=>{
    const {userId} = req.body;

    const query =`
        SELECT passengerId
        FROM CarpoolPassengers
        WHERE passengerId = ?;
    `
    try {
        const result = await new Promise((resolve,reject)=>{
            connection.query(query,[userId],(err,results)=>{
                if(err) return reject(err)
               resolve(results)    
            })
        })

        if(result.length > 0){
            res.status(200).send({isBooked: true})
        }else{
            res.status(200).send({isBooked:false})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }
}

const fetchPassengers= async(req,res)=>{
    const {userId} = req.body;

    const query = `
        SELECT  u.userId,u.userFn,u.userLn,c.carpoolRouteId,c.carpoolRouteId,c.numPassengersBooked
        FROM CarpoolPassengers c
        JOIN Users  AS u ON u.userId = c.passengerId
        WHERE driverId =?
    `

    try {
        const result = await new Promise((resolve,reject)=>{
            connection.query(query,[userId],(err,results)=>{
                if(err) return reject(err)
                resolve(results)     
            })
        })

        if(result.length > 0){
            res.status(200).send(result)
        }else{
            res.send({message:"failed to fetch carpool passengers"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }

}







export{createCarpoolRide,fetchCarpoolRide,fetchAllCarpoolRide,CarpoolPassenger,isBookedAlready,
    fetchPassengers
}