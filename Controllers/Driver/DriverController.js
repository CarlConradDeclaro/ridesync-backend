import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { checkEmailExists, getUserByEmail, registerUserQuery } from '../../Database/UserQuries/userQuries.js';
import connection from '../../Database/Connection/Connection.js';

const createToken = (id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ id }, jwtkey, { expiresIn: "1d" });
}

const driverRegisterUser = async (req, res) => {
    try {
        const { userLn, userFn, userEmail, userPhone, userPassword, userType, userRating, gender, country } = req.body;

        const emailExists = await checkEmailExists(userEmail);
        if (emailExists) {
            return res.status(400).send({ message: "Email is already in use" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(userPassword, salt)

        // Insert the new user
        await registerUserQuery({
            userLn,
            userFn,
            userEmail,
            userPhone,
            userPassword: hashedPassword,
            userType,
            userRating,
            gender,
            country,
        });

        res.status(201).send({ message: "User registered successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
    }
}

const driverLogin = async (req, res) => {
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

const getUsers = (req, res) => {
    connection.query('SELECT * FROM USERS', (err, results) => {
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

export { driverRegisterUser, driverLogin };
