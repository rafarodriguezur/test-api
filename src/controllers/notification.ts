import { Request, Response } from 'express';
import { NotificationModel } from '../model/notification';
import { NotificationConfigurationModel } from '../model/notificationConfiguration';
import { Expo } from 'expo-server-sdk';

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

  updateStatusNotification = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const result: any = await NotificationModel.updateStatusNotification(id)

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

  sendNotification = async (_req: Request, res: Response) => {
    const result = await NotificationConfigurationModel.getNotificationsConfiguration();
    
    if (result !== null) {

      let expo = new Expo({
        accessToken: '',
        useFcmV1: true
      });

      const notifications = await NotificationModel.getNotificationsPending(result.hour);
      let messages: any[] = [];

      if (notifications?.length) {
        for (let notification of notifications!) {
          if (notification.token !== null) {
            if (!Expo.isExpoPushToken(notification.token)) {
              console.error(`Push token ${notification.token} is not a valid Expo push token`);
              continue;
            }
    
            messages.push({
              to: notification.token,
              title: '¡Gracias por visitar ' + notification.name + '!',
              sound: 'default',
              body: 'Nos gustaría saber ¿Cómo te fué?',
              data: { notificationId: notification.notificationid, healthFacilityId: notification.healthfacilityid, name: notification.name, date: notification.date },
            })
          }
        }
      }

      let chunks = expo.chunkPushNotifications(messages);

      let tickets: any[] = [];
      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
          } catch (error) {
            console.error(error);
          }
        }
      })();

      return res.status(201).json({
        success: true,
        data: notifications
      });
    }
    return res.status(201).json({
      success: true,
      data: []
    });
  }
}