import express from 'express'
import cors from 'cors'
import dotenv  from 'dotenv'
import userRoute from './Routes/userRoutes.js'
 


dotenv.config()
const app = express();
 

app.use(express.json())
app.use(cors())



app.get('/',(req,res)=>{
    res.send("Welcom to ridesync")
})

 

app.use("/api/users",userRoute)




const port  = process.env.PORT || 5000

app.listen(port,(req,res)=>{
    console.log(`Server running on PORT: ${port}`);  
})