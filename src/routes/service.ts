import { Router } from 'express'
import { ServiceController } from '../controllers/service'

const router = Router()

const serviceController = new ServiceController()

router.get('/', serviceController.getAll)
router.post('/access-service-glossary', serviceController.saveAccessServiceGlossary)
router.post('/service-selection', serviceController.saveServiceSelection)
router.post('/service-health-facility-selection', serviceController.saveServiceAndHealthFacilitySelection)

export default router