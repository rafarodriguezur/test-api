import { Request, Response } from 'express';
import { NotificationModel } from '../model/notification'

export class NotificationController {

  save = async (req: Request, res: Response) => {
    const notification = req.body
    const result: any = await NotificationModel.save(notification)

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