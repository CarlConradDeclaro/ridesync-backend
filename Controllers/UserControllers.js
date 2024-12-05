import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import connection from '../Database/Connection/Connection.js';
import { checkEmailExists, registerUserQuery, getUserByEmail, registerPassengerQuery } from '../Database/UserQuries/userQuries.js'; // Add .js
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client("62174630498-98j6kmqjt4q2ipgcdi0nbcj13r8daq3s.apps.googleusercontent.com");


const createToken = (id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ id }, jwtkey, { expiresIn: "1d" });
}

const registerUser = async (req, res) => {
    try {
        const { userLn, userFn, userEmail, userPhone, userAge,userPassword, userType, userRating, gender, country, demoStat } = req.body;

        const emailExists = await checkEmailExists(userEmail);
        if (emailExists) {
            return res.status(400).send({ message: "Email is already in use" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(userPassword, salt)

        // Insert the new user
        await registerPassengerQuery({
            userLn,
            userFn,
            userEmail,
            userPhone,
            userAge,
            userPassword: hashedPassword,
            userType,
            userRating,
            gender,
            country,
            demoStat
        });

        res.status(201).send({ message: "User registered successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
}

const logInUser = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;
        if (!userEmail && !userPassword) {
            return res.status(400).send({ message: "Please fill necessary details below " });
        }
        const emailExists = await checkEmailExists(userEmail);
        if (!emailExists) {
            return res.status(400).send({ message: "Email not registered!" });
        }

        const user = await getUserByEmail(userEmail);
        if (!user) {
            return res.status(400).send({ message: "User not found!" });
        }

        const isMatch = await bcrypt.compare(userPassword, user.userPassword)
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid password" });
        }

        const token = createToken(user.userId);
        res.status(200).send({
            user: {
                id: user.userId,
                userEmail: user.userEmail,
                userType: user.userType
            },
            token,

        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
}

const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: "62174630498-98j6kmqjt4q2ipgcdi0nbcj13r8daq3s.apps.googleusercontent.com",
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await getUserByEmail(email);

        // Generate JWT token for the user
        const jwtToken = createToken(user.userId);

        // Send response with user details and token
        res.status(200).send({
            user: {
                id: user.userId,
                userEmail: user.userEmail,
                userType: user.userType,
            },
            token: jwtToken,
        });
    } catch (error) {
        res.status(500).json({ message: "Email is not registered", error: error.message });
    }
};


const getUsers = (req, res) => {
    // connection.query('SELECT * FROM USERS as u INNER JOIN  Vehicle as v On v.userId = u.userId', (err, results) => {
    const query =`
        SELECT u.*, 
            v.vehicleId, 
            v.userId AS driverId, 
            v.carType, 
            v.manufacturerName, 
            v.modelName, 
            v.modelYear, 
            v.vehiclePlateNo, 
            v.vehicleSets, 
            v.vehicleColor, 
            v.typeRide
        FROM USERS AS u
        LEFT JOIN Vehicle AS v ON v.userId = u.userId
        WHERE u.userType IN ('D', 'P');

 

    `
    connection.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                message: "Error fetching data"
            });
        } else {
            res.json(results);
        }
    });
}


const updateProfile = async (req, res) => {
    const { firstname, lastname, email, phonNum, userId } = req.body;

    // if (!firstname || !lastname || !email || !phonNum || !userId) {
    //     return res.status(400).json({ message: 'All fields are required' });
    // }

    const query = `
        UPDATE Users
        SET userLn = ?, userFn = ?, userEmail = ?, userPhone = ?
        WHERE userId = ?;
    `;

    connection.query(query, [firstname, lastname, email, phonNum, userId], (err, result) => {
        if (err) {
            console.error('Error updating profile:', err);
            return res.status(500).json({ message: 'Failed to update profile' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully' });
    });
};


export { registerUser, getUsers, logInUser, googleLogin ,updateProfile};
