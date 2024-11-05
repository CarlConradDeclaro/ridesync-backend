import express from 'express'
import { GetAllRideRequest } from '../Controllers/Driver/GetAllRideRequest.js'
import { PotentialRide } from '../Controllers/Driver/PotentialRide.js'
import { driverLogin, driverRegisterUser } from '../Controllers/Driver/DriverController.js'
const router = express.Router()


router.post("/register", driverRegisterUser)
router.post("/login", driverLogin)
router.get('/passengerRequest', GetAllRideRequest)
router.post('/potentialRide', PotentialRide)

export default router;