import express from 'express'

import { registerUser, getUsers, logInUser } from '../Controllers/UserControllers.js';
import { getCancelledRoutes, getRequestRide, getRouteRequest, RouteCancelled, RouteRequest } from '../Controllers/Passenger/RoutesRequest.js'
import { Location } from '../Controllers/Passenger/Map.js'
import { CancelledAllPotentialDrivers, driverSelected, GetAllPotentialRide, getRides } from '../Controllers/Passenger/GetPotentialDriver.js';
import { Booking } from '../Controllers/Passenger/Booking.js';



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
router.post("/getCancelledRoutes", getCancelledRoutes)
router.post("/booking", Booking)





router.put("/routeCancelled", RouteCancelled)


export default router;
