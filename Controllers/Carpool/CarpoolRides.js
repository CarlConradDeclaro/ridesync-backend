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
      SELECT * FROM CarpoolRoutes WHERE userId = ?
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

export{createCarpoolRide,fetchCarpoolRide}