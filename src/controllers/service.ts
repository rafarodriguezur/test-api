import { Request, Response } from 'express';
import { ServiceModel } from '../model/service'

export class ServiceController {

  getAll = async (_req: Request, res: Response) => {
    const services = await ServiceModel.getAll()
    res.json(services)
  }

  saveAccessServiceGlossary = async (req: Request, res: Response) => {
    const service = req.body
    const result: any = await ServiceModel.saveAccessServiceGlossary(service)

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

  saveServiceSelection = async (req: Request, res: Response) => {
    const service = req.body
    const result: any = await ServiceModel.saveServiceSelection(service)

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

  updateServiceSelection = async (req: Request, res: Response) => {
    const service = req.body
    const result: any = await ServiceModel.updateServiceSelection(service)

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

  saveHealthFacilitySelection = async (req: Request, res: Response) => {
    const service = req.body
    const result: any = await ServiceModel.saveHealthFacilitySelection(service)

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

  updateHealthFacilitySelection = async (req: Request, res: Response) => {
    const service = req.body
    const result: any = await ServiceModel.updateHealthFacilitySelection(service)

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