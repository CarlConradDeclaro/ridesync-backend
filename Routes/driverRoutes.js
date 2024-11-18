import express from 'express'
import { GetAllRideRequest, GetOnGoingRoute } from '../Controllers/Driver/GetAllRideRequest.js'
import { fetchIfDriverOfferingRide, getRides, PotentialRide, Ride } from '../Controllers/Driver/PotentialRide.js'
import { driverLogin, driverRegisterUser } from '../Controllers/Driver/DriverController.js'
import { getBookingRides, getRecentRides } from '../Controllers/Driver/ViewRides.js'
const router = express.Router()


router.post("/register", driverRegisterUser)
router.post("/login", driverLogin)
router.get('/passengerRequest', GetAllRideRequest)
router.post('/potentialRide', PotentialRide)
router.post('/rides', Ride)
router.post('/getRides', getRides)
router.post('/getOnGoingRoute', GetOnGoingRoute)
router.post('/fetchIfDriverOfferingRide', fetchIfDriverOfferingRide)
router.post('/recentRides', getRecentRides)
router.post('/bookingRides', getBookingRides)


export default router;
