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

  saveSurveyAnswer = async (req: Request, res: Response) => {
    const body = req.body
    const result: any = await SatisfactionSurveyModel.saveSurveyAnswer(body)

    if (result.error) {
      return res.status(501).json({
          success: false,
          error: result.error
      });
    }

    return res.status(201).json({
        success: true,
        data: result
    });
  }

  getRatingPercentage = async (req: Request, res: Response) => {
    const healthFacilityId: number = Number(req.params.id);
    const ratingPercentages = await SatisfactionSurveyModel.getRatingPercentage(healthFacilityId);
    res.json(ratingPercentages);
  }

  getComments = async (req: Request, res: Response) => {
    const healthFacilityId: number = Number(req.params.id);
    const deviceId: string = String(req.params.deviceId);
    const orderBy: string = req.query.orderBy ? String(req.query.orderBy) : 'date';
    const order: string = req.query.order ? String(req.query.order) : 'asc';
    const page: number = req.query.page ? Number(req.query.page) : 1;
    const ratingPercentages = await SatisfactionSurveyModel.getComments(healthFacilityId, deviceId, orderBy, order, page);
    res.json(ratingPercentages);
  }

  commentDetail = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const comment = await SatisfactionSurveyModel.commentDetail(id);
    res.json(comment);
  }

  ratingDetail = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const rating = await SatisfactionSurveyModel.ratingDetail(id);
    res.json(rating);
  }

  getHistoryRating = async (req: Request, res: Response) => {
    const id: string = String(req.params.id);
    const page: number = req.query.page ? Number(req.query.page) : 1;
    const history = await SatisfactionSurveyModel.getHistoryRating(id, page);
    res.json(history);
  }
  
}