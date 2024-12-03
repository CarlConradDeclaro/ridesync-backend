import { query } from "express";
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

const isCarpoolBooked = async(req,res)=>{
    const {routeId,userId}= req.body
    const query = `
        SELECT *  FROM CarpoolPassengers
    `

    try {
        const result = await new Promise((resolve,reject)=>{
            connection.query(query,[routeId,userId],(err,results)=>{
                if(err)return reject(err)
                resolve(results)    
            })
        })
        if(result.length > 0){
            res.status(200).json(result)
        }else{
            res.status(200).send({status:false})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error" });
    }

}

const CarpoolPassenger = async (req, res) => {
    const { passengerId, carpoolRouteId, driverId, numPassengersBooked } = req.body;

    // Query to insert into CarpoolPassengers
    const query = `
        INSERT INTO CarpoolPassengers (passengerId, carpoolRouteId, driverId, numPassengersBooked)
        VALUES (?, ?, ?, ?)
    `;

    try {
        // Insert into CarpoolPassengers
        const result = await new Promise((resolve, reject) => {
            connection.query(query, [passengerId, carpoolRouteId, driverId, numPassengersBooked], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        // Check if the insert was successful
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Booking successful", result });
        } else {
            res.status(400).json({ message: "Failed to add booking" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

 
 
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


const fetchBookedCarpools = async(req,res)=>{
    const {userId} = req.body;
    
    const query =`
    SELECT * 
    FROM CarpoolPassengers as cp
    JOIN CarpoolRoutes as c ON c.routeId =   cp.carpoolRouteId
    JOIN Users as u ON u.userId = cp.driverId
    JOIN Vehicle as v ON v.userId = u.userId
    WHERE passengerId  = ?;
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


const getCompletedCarpools = async(req,res)=>{
    const {userId} =req.body
    const query = `
        SELECT * 
        FROM CarpoolRoutes as cr
        WHERE cr.userId = ?;
    `
    try {
        const result = await new Promise((resolve,reject)=>{
            connection.query(query,[userId],(err,results)=>{
                if(err)return reject(err)
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

const getCarpoolPassengers = async(req,res)=>{
    const {carpoolRouteId} = req.body
    // const query = `
    //     SELECT u.*
    //     FROM CarpoolPassengers as c 
    //     INNER JOIN Users as u ON u.userId = c.passengerId
    //     WHERE carpoolRouteId = ?;
    // `

    const query = `
        SELECT *
        FROM CarpoolPassengers;
    `
    try {
        const result = await new Promise((resolve,reject)=>{
            connection.query(query,[carpoolRouteId],(err,results)=>{
                if(err)return reject(err)
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

const markCarpoolCompleted = async(req, res) => {
    const { routeId } = req.body;
    if (!routeId) {
        return res.status(400).json({ error: 'routeId is required' });
    }
    const query = `
        UPDATE CarpoolRoutes
        SET status = 'completed'
        WHERE routeId = ?;
    `;
    try {
        const result = connection.query(query, [routeId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Carpool not found' });
        }
        return res.status(200).json({ message: 'Carpool marked as completed' });
    } catch (error) {
        console.error('Error marking carpool as completed:', error);
        return res.status(500).json({ error: 'An error occurred while updating the carpool' });
    }
};



export{createCarpoolRide,fetchCarpoolRide,fetchAllCarpoolRide,CarpoolPassenger,isBookedAlready,
    fetchPassengers,isCarpoolBooked,fetchBookedCarpools,getCompletedCarpools,getCarpoolPassengers,
    markCarpoolCompleted
}