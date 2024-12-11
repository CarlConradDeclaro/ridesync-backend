import express from 'express'

import { registerUser, getUsers, logInUser, googleLogin, updateProfile, deleteProfile } from '../Controllers/UserControllers.js';
import { getCancelledRoutes, getRecentRide, getRequestRide, getRouteRequest, rateUser, RouteCancelled, RouteRequest, updateRoutesToCompleted } from '../Controllers/Passenger/RoutesRequest.js'
import { Location } from '../Controllers/Passenger/Map.js'
import { CancelledAllPotentialDrivers, driverSelected, GetAllPotentialRide, getRides } from '../Controllers/Passenger/GetPotentialDriver.js';
import { Booking, cancelBooking, getBookings, markBookingAsDone } from '../Controllers/Passenger/Booking.js';
import { createChats, getChats, getDriver, getMessages, sendMessage } from '../Controllers/Chats.js';
import { CarpoolPassenger, fetchAllCarpoolRide, fetchBookedCarpools, isBookedAlready, isCarpoolBooked } from '../Controllers/Carpool/CarpoolRides.js';



const router = express.Router()
router.post("/login", logInUser)
router.get("/", getUsers)
router.get('/search', Location)
router.post('/getPotentialRide', GetAllPotentialRide)
router.put('/selectedDriver', driverSelected)
router.post('/getRides', getRides)
router.put('/cancelAllPotentialDrivers', CancelledAllPotentialDrivers)
router.post("/getRouteRequest", getRouteRequest)
router.post("/getRequestRide", getRequestRide)
router.post("/register", registerUser)
router.post("/routeRequest", RouteRequest)
router.post("/getRecentRide", getRecentRide)
router.post("/getCancelledRoutes", getCancelledRoutes)
router.post("/booking", Booking)
router.post("/getBookings", getBookings)
router.put("/updateRidesToCompleted", updateRoutesToCompleted)

router.post("/getDriver", getDriver)
router.post("/getChats", getChats)
router.post("/createChat", createChats)
router.post("/sendMessage", sendMessage)
router.post("/getMessages", getMessages)
router.post("/google-login", googleLogin)
router.get('/fetchAllCarpoolRides',fetchAllCarpoolRide)
router.post('/CarpoolPassenger',CarpoolPassenger)
router.post('/isBookedAlready',isBookedAlready)
router.post('/isCarpoolBooked',isCarpoolBooked)
router.post('/fetchBookedCarpools',fetchBookedCarpools)
router.post('/cancelBooking',cancelBooking)
router.post('/markBookingAsDone',markBookingAsDone)
router.put("/routeCancelled", RouteCancelled)
router.post("/rateUser", rateUser)
router.post("/updateProfile",updateProfile)
router.post("/deleteProfile",deleteProfile)

export default router;
