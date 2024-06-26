import { Request, Response } from 'express';
import { UserModel } from '../model/user'

export class UserController {

  save = async (req: Request, res: Response) => {
    const user = req.body
    const result: any = await UserModel.save(user)

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


  updateToken = async (req: Request, res: Response) => {
    const user = req.body
    const result: any = await UserModel.updateToken(user)

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

  getUser = async (req: Request, res: Response) => {
    const deviceId: string = String(req.params.id);
    const result: any = await UserModel.getUser(deviceId)

    if (result?.error) {
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