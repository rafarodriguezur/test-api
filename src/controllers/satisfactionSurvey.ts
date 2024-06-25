import { Request, Response } from 'express';
import { SatisfactionSurveyModel } from '../model/satisfactionSurvey';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
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
    const result: any = await SatisfactionSurveyModel.saveComment(body);
    this.send();

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

  send = () => {
    try {
      const transporter: Transporter = nodemailer.createTransport({
        service: "Outlook365",
        secure: true,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.PASSWORD_EMAIL
        }
      });
      transporter.sendMail({
        from: `"DR5 Starts Youth" <${process.env.USER_EMAIL}>`,
        to: process.env.TO_EMAIl,
        subject: 'New rating and comment in DR5 Starts Youth',
        html: `<table style="width: 100%; background-color: white;">
                <tbody>
                  <tr>
                    <td align="center">
                      <img style="width: 100px;" alt="logo" src="https://strapi-production-0271.up.railway.app/uploads/logo_0033d54dc2.png"/>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table style="width: 570px; background-color: #ffffff; margin: 0 auto; padding: 0;">
                        <tbody>
                          <tr>
                            <td style="padding: 35px;">
                              <div>
                                <div>
                                  <p style="font-weight: 600;">Hello Admin,</p>
                                </div>            
                                <div>
                                  <p>You are notified that a user has left a new rating and comment on the DR5 Starts Youth app.</p>
                                </div>           
                                <div>
                                  <span>Recommended actions:</span>
                                </div>
                                <ul>
                                  <li>Review the user's rating and comment.</li>
                                  <li>Disapprove the comment if necessary.</li>
                                  <li>Unsubscribe the user if necessary.</li>
                                  <li>Take appropriate measures to improve the service if necessary.</li>
                                </ul>
                                <div>
                                  <p>Thank you for your attention to this matter.</p>
                                </div>      
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f4f4f7;">
                      <table style="width: 570px;margin: 0 auto; padding: 0;">
                        <tbody>
                          <tr>
                            <td style="padding: 35px;">
                              <p style="text-align: center;">Sincerely,</p>
                              <p style="text-align: center;">DR5 Starts Youth Support</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
      `
      });
    } catch (error) {
      console.error('Error al enviar correo electrónico:', error);
    }   
  }

  sendMail = async (_req: Request, res: Response) => {

    try {
      // Crea el objeto transportador
      const transporter: Transporter = nodemailer.createTransport({
        //host: 'smtp.office365.com',
        //port: 465,
        service: "Outlook365",
        secure: true,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.PASSWORD_EMAIL
        }
      });
  
      // Envía el correo electrónico
      await transporter.sendMail({
        from: `"DR5 Starts Youth" <${process.env.USER_EMAIL}>`,
        to: process.env.TO_EMAIl,
        subject: 'New rating and comment in DR5 Starts Youth',
        html: `<table style="width: 100%; background-color: white;">
                <tbody>
                  <tr>
                    <td align="center">
                      <img style="width: 100px;" alt="logo" src="https://strapi-production-0271.up.railway.app/uploads/logo_0033d54dc2.png"/>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table style="width: 570px; background-color: #ffffff; margin: 0 auto; padding: 0;">
                        <tbody>
                          <tr>
                            <td style="padding: 35px;">
                              <div>
                                <div>
                                  <p style="font-weight: 600;">Hello Admin,</p>
                                </div>            
                                <div>
                                  <p>You are notified that a user has left a new rating and comment on the DR5 Starts Youth app.</p>
                                </div>           
                                <div>
                                  <span>Recommended actions:</span>
                                </div>
                                <ul>
                                  <li>Review the user's rating and comment.</li>
                                  <li>Disapprove the comment if necessary.</li>
                                  <li>Unsubscribe the user if necessary.</li>
                                  <li>Take appropriate measures to improve the service if necessary.</li>
                                </ul>
                                <div>
                                  <p>Thank you for your attention to this matter.</p>
                                </div>      
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f4f4f7;">
                      <table style="width: 570px;margin: 0 auto; padding: 0;">
                        <tbody>
                          <tr>
                            <td style="padding: 35px;">
                              <p style="text-align: center;">Sincerely,</p>
                              <p style="text-align: center;">DR5 Starts Youth Support</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
      `
      });
      return res.status(201).json({
        success: true,
        data: {}
      });
    } catch (error) {
      console.error('Error al enviar correo electrónico:', error);
      return res.status(400).json({
        success: false,
        data: {},
        error: error
      });
    }   
  }
  
}