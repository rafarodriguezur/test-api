import { Request, Response } from 'express';
import { UserSessionModel } from '../model/userSession'

export class UserSessionController {

  save = async (req: Request, res: Response) => {
    const user = req.body
    const result: any = await UserSessionModel.save(user)

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