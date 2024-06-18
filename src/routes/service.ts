import { Router } from 'express'
import { ServiceController } from '../controllers/service'

const router = Router()

const serviceController = new ServiceController()

router.get('/', serviceController.getAll)
router.post('/access-service-glossary', serviceController.saveAccessServiceGlossary)
router.post('/service-selection', serviceController.saveServiceSelection)
router.put('/service-selection', serviceController.updateServiceSelection)
router.post('/service-health-facility-selection', serviceController.saveHealthFacilitySelection)
router.put('/service-health-facility-selection', serviceController.updateHealthFacilitySelection)

export default router