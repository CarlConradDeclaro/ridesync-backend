import express from 'express'

import { registerUser, getUsers, logInUser } from '../Controllers/UserControllers.js';
import { getRouteRequest, RouteCancelled, RouteRequest } from '../Controllers/Passenger/RoutesRequest.js'
import { Location } from '../Controllers/Passenger/Map.js'
import { CancelledAllPotentialDrivers, GetAllPotentialRide } from '../Controllers/Passenger/GetPotentialDriver.js';



const router = express.Router()

router.get("/", getUsers)
router.get('/search', Location)

router.post('/getPotentialRide', GetAllPotentialRide)
router.put('/cancelAllPotentialDrivers', CancelledAllPotentialDrivers)

router.post("/getRouteRequest", getRouteRequest)

router.post("/register", registerUser)
router.post("/login", logInUser)

router.post("/routeRequest", RouteRequest)


router.put("/routeCancelled", RouteCancelled)


export default router;
