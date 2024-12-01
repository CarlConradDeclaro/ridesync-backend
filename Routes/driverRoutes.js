import express from 'express'
import { GetAllRideRequest, GetOnGoingRoute } from '../Controllers/Driver/GetAllRideRequest.js'
import { fetchIfDriverOfferingRide, getRides, PotentialRide, Ride } from '../Controllers/Driver/PotentialRide.js'
import { driverLogin, driverRegisterUser, driverRole } from '../Controllers/Driver/DriverController.js'
import { getBookingRides, getCancelledRides, getRecentRides } from '../Controllers/Driver/ViewRides.js'
import { createCarpoolRide, fetchCarpoolRide, fetchPassengers } from '../Controllers/Carpool/CarpoolRides.js'
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
router.post('/driverRole',driverRole)
router.post('/createCarpoolRide',createCarpoolRide)
router.post('/fetchCarpoolRides',fetchCarpoolRide)
router.post('/fetchPassengers',fetchPassengers)
router.post('/fetchCancelledRides',getCancelledRides)


export default router;
