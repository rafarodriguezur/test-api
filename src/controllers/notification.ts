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
        accessToken: process.env.NOTIFICATION_TOKEN,
        useFcmV1: true
      });

      const notifications = await NotificationModel.getNotificationsPending(result.hour);
      let messages: any[] = [];

      let notificationIds = [];
      if (notifications?.length) {
        for (let notification of notifications!) {
          if (notification.token !== null) {
            if (!Expo.isExpoPushToken(notification.token)) {
              console.error(`Push token ${notification.token} is not a valid Expo push token`);
              continue;
            }

            notificationIds.push(notification.notificationid)
    
            messages.push({
              to: notification.token,
              title: '¡Gracias por visitar ' + notification.name + '!',
              sound: 'default',
              body: 'Nos gustaría saber ¿Cómo te fué?',
              data: { typeNotification: 1, notificationId: notification.notificationid, healthFacilityId: notification.healthfacilityid, name: notification.name, date: notification.date },
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

      await NotificationModel.updateNumberNotificationsSent(notificationIds)

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

  sendNotificationReminder = async (_req: Request, res: Response) => {
    const result = await NotificationConfigurationModel.getNotificationsConfiguration();
    
    if (result !== null) {

      let expo = new Expo({
        accessToken: process.env.NOTIFICATION_TOKEN,
        useFcmV1: true
      });

      const numberNotifications = Number(process.env.NUMBER_NOTIFICATIONS);
      const notifications = await NotificationModel.getNotificationsPendingReminder(result.hour, numberNotifications);
      let messages: any[] = [];

      let notificationIds = [];
      if (notifications?.length) {
        for (let notification of notifications!) {
          if (notification.token !== null) {
            if (!Expo.isExpoPushToken(notification.token)) {
              console.error(`Push token ${notification.token} is not a valid Expo push token`);
              continue;
            }

            notificationIds.push(notification.notificationid)
    
            messages.push({
              to: notification.token,
              title: '¡Gracias por visitar ' + notification.name + '!',
              sound: 'default',
              body: 'Nos gustaría saber ¿Cómo te fué?',
              data: { typeNotification: 1, notificationId: notification.notificationid, healthFacilityId: notification.healthfacilityid, name: notification.name, date: notification.date },
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

      await NotificationModel.updateNumberNotificationsSent(notificationIds)

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

  sendNotificationReminderFinishSurvey = async (_req: Request, res: Response) => {
    let expo = new Expo({
      accessToken: process.env.NOTIFICATION_TOKEN,
      useFcmV1: true
    });

    const numberNotifications = Number(process.env.NUMBER_NOTIFICATIONS_SURVEY);
    const timeNotifications = Number(process.env.TIME_NOTIFICATIONS_SURVEY);
    const notifications = await NotificationModel.getNotificationsReminderFinishSurvey(timeNotifications, numberNotifications);
    let messages: any[] = [];

    let surveyAnswerIds = [];
    if (notifications?.length) {
      for (let notification of notifications!) {
        if (notification.token !== null) {
          if (!Expo.isExpoPushToken(notification.token)) {
            console.error(`Push token ${notification.token} is not a valid Expo push token`);
            continue;
          }

          surveyAnswerIds.push(notification.surveyanswerid)
  
          messages.push({
            to: notification.token,
            title: '¡Gracias por visitar ' + notification.name + '!',
            sound: 'default',
            body: 'No olvides terminar la encuesta',
            data: { typeNotification: 2, surveyAnswerId: notification.surveyanswerid, healthFacilityId: notification.healthfacilityid, name: notification.name, date: notification.date },
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

    await NotificationModel.updateNumberNotificationsSentFinishSurvey(surveyAnswerIds);

    return res.status(201).json({
      success: true,
      data: notifications
    });
  }

  sendNotificationReminderSkip = async (_req: Request, res: Response) => {
    let expo = new Expo({
      accessToken: process.env.NOTIFICATION_TOKEN,
      useFcmV1: true
    });

    const numberNotifications = Number(process.env.NUMBER_NOTIFICATIONS_SKIP);
    const timeNotifications = Number(process.env.TIME_NOTIFICATIONS_SKIP);
    const notifications = await NotificationModel.getNotificationsPendingReminderSkip(timeNotifications, numberNotifications);
    let messages: any[] = [];

    let surveyAnswerIds = [];
    if (notifications?.length) {
      for (let notification of notifications!) {
        if (notification.token !== null) {
          if (!Expo.isExpoPushToken(notification.token)) {
            console.error(`Push token ${notification.token} is not a valid Expo push token`);
            continue;
          }

          surveyAnswerIds.push(notification.surveyanswerid)
  
          messages.push({
            to: notification.token,
            title: '¡Gracias por visitar ' + notification.name + '!',
            sound: 'default',
            body: 'Nos gustaría saber ¿Cómo te fué?',
            data: { typeNotification: 3, surveyAnswerId: notification.surveyanswerid, healthFacilityId: notification.healthfacilityid, name: notification.name, date: notification.date },
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

    await NotificationModel.updateNumberNotificationsSentFinishSurvey(surveyAnswerIds);

    return res.status(201).json({
      success: true,
      data: notifications
    });
  }
}

