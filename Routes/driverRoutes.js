import express from 'express'
import { GetRequest } from '../Controllers/DriverRequest/GetRequest.js'
const router = express.Router()



router.get('/passengerRequest', GetRequest)

export default router;
