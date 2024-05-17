import { Request, Response } from 'express';
import { FacilityModel } from '../model/facility'

export class FacilityController {

  getAllByService = async (req: Request, res: Response) => {
    const serviceId: number = Number(req.params.id);
    const latitude: number = Number(req.query.latitude);
    const longitude: number = Number(req.query.longitude);
    const page: number = req.query.page ? Number(req.query.page) : 1;
    const facilities = await FacilityModel.getAllByService(serviceId, latitude, longitude, page)
    res.json(facilities)
  }
}