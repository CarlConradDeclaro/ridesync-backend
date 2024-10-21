import dotenv  from 'dotenv'
import mysql from 'mysql2'


dotenv.config()

const connection = mysql.createConnection({
    host: process.env.HOST,
    user:process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})  

connection.connect((err)=>{
    if(err){
       console.error('Error connecting to MySQL:', err.message);
       return;
    }
    console.log("Connected to mysql database");  
})

export default connection;