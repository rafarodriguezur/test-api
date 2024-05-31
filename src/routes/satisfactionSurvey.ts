import { Router } from 'express'
import { SatisfactionSurveyController } from '../controllers/satisfactionSurvey'

const router = Router()

const controller = new SatisfactionSurveyController()

router.post('/', controller.save)
router.post('/comment', controller.saveComment)

export default router