import { Router } from 'express'
import { ServiceController } from '../controllers/service'

const router = Router()

const serviceController = new ServiceController()

router.get('/', serviceController.getAll)

export default router