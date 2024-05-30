import { Router } from 'express'
import { SurveryQuestionController } from '../controllers/surveyQuestion'

const router = Router()

const surveryQuestionController = new SurveryQuestionController()

router.get('/', surveryQuestionController.getAll)

export default router