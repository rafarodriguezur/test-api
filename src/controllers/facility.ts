import { Request, Response } from 'express';
import { FacilityModel } from '../model/facility'

export class FacilityController {

  getAllByService = async (req: Request, res: Response) => {
    const serviceId: number = Number(req.params.id);
    const services = await FacilityModel.getAllByService(serviceId)
    res.json(services)
  }
}