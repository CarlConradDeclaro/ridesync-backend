import connection from "../Connection/Connection.js"


export const checkEmailExists = (email) => {
    const query = `
            SELECT * FROM USERS 
            WHERE userEmail = ?`

    return new Promise((resolve, reject) => {
        connection.query(query, [email], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results.length > 0)
        })
    })
}
export const registerPassengerQuery = (userData) => {
    const { userLn, userFn, userEmail, userPhone, userAge,userPassword, userType, userRating, gender, country, demoStat
     } = userData;
    const query = `
    INSERT INTO Users (userLn, userFn, userEmail, userPhone,age,
                       userPassword, userType, userRating,Gender,Country,DemoStat) 
                       VALUES (?, ?, ?, ?,?, ?, ?, ?,?,?,?)`


    return new Promise((resolve, reject) => {
        connection.query(query,
            [userLn, userFn, userEmail, userPhone, userAge, userPassword, userType, userRating, gender, country, demoStat],
            (err) => {
                if (err) {
                    return reject(err)
                }
               
                  resolve();
                 
            })
    })
}


export const registerUserQuery = (userData) => {
    const { userLn, userFn, userEmail, userPhone, userPassword, userType, userRating, gender, country, demoStat,
        carType, manufacturerName, modelName, modelYear, vehiclePlateNo, vehicleSets, vehicleColor, typeRide
     } = userData;
    const query = `
    INSERT INTO Users (userLn, userFn, userEmail, userPhone,
                       userPassword, userType, userRating,Gender,Country,DemoStat,typeRide) 
                       VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?)`

     const query2 = `
                       INSERT INTO Vehicle (userId, carType, manufacturerName, modelName, modelYear, 
                                            vehiclePlateNo, vehicleSets, vehicleColor, typeRide)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                       `;    

    return new Promise((resolve, reject) => {
        connection.query(query,
            [userLn, userFn, userEmail, userPhone, userPassword, userType, userRating, gender, country, demoStat,typeRide],
            (err,results) => {
                if (err) {
                    return reject(err)
                }
                const userId = results.insertId
                connection.query(query2,
                    [userId, carType, manufacturerName, modelName, modelYear, vehiclePlateNo, vehicleSets, vehicleColor, typeRide],
                    (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve("User and vehicle inserted successfully!");
                    }
                );
            })
    })
}

export const getUserByEmail = (email) => {
    const query = `
                     SELECT * 
                     FROM  USERS 
                     WHERE userEmail = ?`
    return new Promise((resolve, reject) => {
        connection.query(query, [email], (err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results[0])
        })
    })
}
