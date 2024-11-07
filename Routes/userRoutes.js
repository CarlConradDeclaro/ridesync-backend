import express from 'express'

import { registerUser, getUsers, logInUser } from '../Controllers/UserControllers.js';
import { getRequestRide, getRouteRequest, RouteCancelled, RouteRequest } from '../Controllers/Passenger/RoutesRequest.js'
import { Location } from '../Controllers/Passenger/Map.js'
import { CancelledAllPotentialDrivers, driverSelected, GetAllPotentialRide, getRides } from '../Controllers/Passenger/GetPotentialDriver.js';



const router = express.Router()

router.get("/", getUsers)
router.get('/search', Location)

router.post('/getPotentialRide', GetAllPotentialRide)
router.put('/selectedDriver', driverSelected)

router.post('/getRides', getRides)

router.put('/cancelAllPotentialDrivers', CancelledAllPotentialDrivers)

router.post("/getRouteRequest", getRouteRequest)
router.post("/getRequestRide", getRequestRide)

router.post("/register", registerUser)
router.post("/login", logInUser)

router.post("/routeRequest", RouteRequest)


router.put("/routeCancelled", RouteCancelled)


export default router;
