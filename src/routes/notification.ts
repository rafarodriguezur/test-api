import { Router } from 'express'
import { NotificationController } from '../controllers/notification'

const router = Router()

const controller = new NotificationController()

router.post('/', controller.save)

export default router