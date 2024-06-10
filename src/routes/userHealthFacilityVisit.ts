import { Router } from 'express'
import { UserHealthFacilityVisitController } from '../controllers/userHealthFacilityVisit';

const router = Router()

const controller = new UserHealthFacilityVisitController()

router.post('/', controller.save)

export default router