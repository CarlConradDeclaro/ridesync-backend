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

export const registerUserQuery = (userData) => {
    const { userLn, userFn, userEmail, userPhone, userPassword, userType, userRating, gender, country, demoStat } = userData;
    const query = `
    INSERT INTO Users (userLn, userFn, userEmail, userPhone,
                       userPassword, userType, userRating,Gender,Country,DemoStat) 
                       VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)`
    return new Promise((resolve, reject) => {
        connection.query(query,
            [userLn, userFn, userEmail, userPhone, userPassword, userType, userRating, gender, country, demoStat],
            (err) => {
                if (err) {
                    return reject(err)
                }
                resolve()
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
