import { Request, Response } from 'express';
import { ServiceModel } from '../model/service'

export class ServiceController {

  getAll = async (_req: Request, res: Response) => {
    const services = await ServiceModel.getAll()
    res.json(services)
  }
}