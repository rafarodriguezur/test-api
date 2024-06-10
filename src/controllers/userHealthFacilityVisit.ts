import { Request, Response } from 'express';
import { UserHealthFacilityVisitModel } from '../model/userHealthFacilityVisit';

export class UserHealthFacilityVisitController {

  save = async (req: Request, res: Response) => {
    const visit = req.body
    const result: any = await UserHealthFacilityVisitModel.save(visit)

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
}