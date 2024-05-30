import { Request, Response } from 'express';
import { SurveyQuestionModel } from '../model/surveyQuestion'

export class SurveryQuestionController {

  getAll = async (_req: Request, res: Response) => {
    const question = await SurveyQuestionModel.getAll()
    res.json(question)
  }
}