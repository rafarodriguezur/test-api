import { Router } from 'express'
import { FacilityController } from '../controllers/facility'

const router = Router()

const facilityController = new FacilityController()

router.get('/:id', facilityController.getHealthFacilityById)
router.get('/service/:id', facilityController.getAllByService)
router.get('/service/:id/order', facilityController.getAllByServiceOrderByName)
router.get('/faqs/:id', facilityController.getAllFaqsByHealthFacilityId)
router.get('/schedule/:id', facilityController.getAllScheduleByHealthFacilityId)

export default router