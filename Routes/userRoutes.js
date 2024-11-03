import express from 'express'

import { registerUser, getUsers, logInUser } from '../Controllers/PassengerRequest/UserControllers.js';
import { RouteCancelled, RouteRequest } from '../Controllers/PassengerRequest/RoutesRequest.js'
import { Location } from '../Controllers/PassengerRequest/Map.js'



const router = express.Router()

router.get("/", getUsers)
router.get('/search', Location)


router.post("/register", registerUser)
router.post("/login", logInUser)

router.post("/routeRequest", RouteRequest)


router.put("/routeCancelled", RouteCancelled)


export default router;
