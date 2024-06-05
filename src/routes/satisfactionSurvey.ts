import { Router } from 'express'
import { SatisfactionSurveyController } from '../controllers/satisfactionSurvey'

const router = Router()

const controller = new SatisfactionSurveyController()

router.post('/', controller.save)
router.post('/comment', controller.saveComment)
router.post('/answer', controller.saveSurveyAnswer)
router.get('/:id/rating', controller.getRatingPercentage)
router.get('/:id/:deviceId/comments', controller.getComments)

export default router