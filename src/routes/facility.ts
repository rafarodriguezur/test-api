import { Router } from 'express'
import { FacilityController } from '../controllers/facility'

const router = Router()

const facilityController = new FacilityController()

router.get('/service/:id', facilityController.getAllByService)
router.get('/service/:id/order', facilityController.getAllByServiceOrderByName)


export default router