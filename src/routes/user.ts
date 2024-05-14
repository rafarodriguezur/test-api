import { Router } from 'express'
import { UserController } from '../controllers/user'

const router = Router()

const controller = new UserController()

router.post('/', controller.save)

export default router