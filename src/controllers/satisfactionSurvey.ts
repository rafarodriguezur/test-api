import { Request, Response } from 'express';
import { SatisfactionSurveyModel } from '../model/satisfactionSurvey'

export class SatisfactionSurveyController {

  save = async (req: Request, res: Response) => {
    const body = req.body
    const result: any = await SatisfactionSurveyModel.save(body)

    if (result.error) {
      return res.status(501).json({
          success: false,
          error: result.error
      });
    }

    return res.status(201).json({
        success: true,
        data: {}
    });
  }

  saveComment = async (req: Request, res: Response) => {
    const body = req.body
    const result: any = await SatisfactionSurveyModel.saveComment(body)

    if (result.error) {
      return res.status(501).json({
          success: false,
          error: result.error
      });
    }

    return res.status(201).json({
        success: true,
        data: {}
    });
  }
}