import { Router } from 'express'
import { UserSessionController } from '../controllers/userSession'

const router = Router()

const controller = new UserSessionController()

router.post('/', controller.save)

export default router