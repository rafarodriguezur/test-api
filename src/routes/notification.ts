import { Router } from 'express'
import { NotificationController } from '../controllers/notification'

const router = Router()

const controller = new NotificationController()

router.post('/', controller.save)
router.get('/send', controller.sendNotification)
router.get('/send-reminder', controller.sendNotificationReminder)
router.get('/send-reminder-finish-survey', controller.sendNotificationReminderFinishSurvey)
router.put('/:id/status', controller.updateStatusNotification)

export default router