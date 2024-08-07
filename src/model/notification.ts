import db from '../db';

export class NotificationModel {

  static async save(input: any) {

    const {
      deviceId,
      healthFacilityId,
      healthFacilityName,
      notificationToken,
      status,
      serviceId
    } = input

    console.log('deviceId', deviceId)

    try {
        const notificationRows = await db.query(
        `SELECT n.notification_id
        	FROM notifications n where n.mac_address = $1 and n.health_facility_id = $2 and n.status = 0 AND n.number_notifications_sent = 0;`, [deviceId, healthFacilityId]
       )
       if (notificationRows?.rows.length === 0) {
        await db.query(
          `INSERT INTO healthcare_service_appointments(mac_address, health_facility_id, service_category_id, appointment_date, confirmed_at, appointment_time)
          VALUES ($1, $2, $3, current_timestamp, current_timestamp, current_time) RETURNING mac_address;`,
          [deviceId, healthFacilityId, serviceId]
        )

        const result = await db.query(
          `INSERT INTO notifications(mac_address, health_facility_id, health_facility_name, notification_token, status, number_notifications_sent, registration_date, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, 0, current_timestamp, current_timestamp, current_timestamp) RETURNING mac_address;`,
          [deviceId, healthFacilityId, healthFacilityName, notificationToken, status]
        )
        return result.rows[0]
       }
			 return notificationRows.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }

  static async updateStatusNotification(id: number) {
    try {
      const userRows = await db.query(`UPDATE notifications SET status = $2, updated_at = $3 WHERE notification_id = $1 RETURNING notification_id;`, [id, 1, new Date()])
      return userRows.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }

  static async getNotificationsPending(hours: number) {
    let result = null
    try {
      result = await db.query(
       `SELECT n.notification_id AS notificationId, hfe.id AS healthFacilityId , hfe.health_facility_name AS name, u.token, TO_CHAR(n.registration_date::date, 'dd/mm/yyyy') as date
       FROM notifications n 
       INNER JOIN users u ON n.mac_address = u.mac_address
       INNER JOIN health_facilities hfe ON n.health_facility_id = hfe.id
       WHERE CURRENT_TIMESTAMP - n.registration_date > interval '${hours} hours' AND n.number_notifications_sent = 0 AND n.status = 0 AND u.is_blocked = false;`
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return []

    return result?.rows
  }

  static async getNotificationsPendingReminder(hours: number, numberNotifications: number) {
    let result = null
    try {
      result = await db.query(
       `SELECT n.notification_id AS notificationId, hfe.id AS healthFacilityId , hfe.health_facility_name AS name, u.token, TO_CHAR(n.registration_date::date, 'dd/mm/yyyy') as date
       FROM notifications n 
       INNER JOIN users u ON n.mac_address = u.mac_address
       INNER JOIN health_facilities hfe ON n.health_facility_id = hfe.id
       WHERE CURRENT_TIMESTAMP - n.registration_date > interval '${hours} hours' AND n.status = 0 AND n.number_notifications_sent > 0 AND n.number_notifications_sent <= ${numberNotifications}  AND u.is_blocked = false;`
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return []

    return result?.rows
  }

  static async getNotificationsReminderFinishSurvey(minutes: number, numberNotifications: number) {
    let result = null
    try {
      result = await db.query(
       `SELECT a.survey_answer_id AS surveyanswerid, a.health_facility_id AS healthfacilityid, hf.health_facility_name AS name, u.token, TO_CHAR(a.created_at::date, 'dd/mm/yyyy') AS date
       FROM health_facility_satisfaction_survey_answers a
       LEFT JOIN health_facility_satisfaction_surveys s
       ON a.survey_answer_id = s.survey_answers_id
       INNER JOIN users u ON a.mac_address = u.mac_address 
       INNER JOIN health_facilities hf ON a.health_facility_id  = hf.id 
       WHERE s.survey_answers_id IS NULL AND a.answer_visit = 1
       AND a.number_notifications_sent <= ${numberNotifications}
       AND a.created_at <= NOW() - INTERVAL '${minutes} minutes';`
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return []

    return result?.rows
  }

  static async getNotificationsPendingReminderSkip(minutes: number, numberNotifications: number) {
    let result = null
    try {
      result = await db.query(
       `SELECT a.survey_answer_id AS surveyanswerid, a.health_facility_id AS healthfacilityid, hf.health_facility_name AS name, u.token, TO_CHAR(a.created_at::date, 'dd/mm/yyyy') AS date
       FROM health_facility_satisfaction_survey_answers a
       LEFT JOIN health_facility_satisfaction_surveys s
       ON a.survey_answer_id = s.survey_answers_id
       INNER JOIN users u ON a.mac_address = u.mac_address 
       INNER JOIN health_facilities hf ON a.health_facility_id  = hf.id 
       WHERE s.survey_answers_id IS NULL AND a.answer_visit = 2
       AND a.number_notifications_sent <= ${numberNotifications}
       AND a.created_at <= NOW() - INTERVAL '${minutes} minutes';`
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return []

    return result?.rows
  }

  static async updateNumberNotificationsSent(ids: any) {
    try {
      const userRows = await db.query(`UPDATE notifications SET number_notifications_sent = (number_notifications_sent + 1), updated_at = current_timestamp 
      WHERE notification_id = ANY ($1) RETURNING notification_id;`, [ids])
      return userRows.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }

  static async updateNumberNotificationsSentFinishSurvey(ids: any) {
    try {
      const userRows = await db.query(`UPDATE health_facility_satisfaction_survey_answers SET number_notifications_sent = (number_notifications_sent + 1), updated_at = current_timestamp 
      WHERE survey_answer_id = ANY ($1) RETURNING survey_answer_id;`, [ids])
      return userRows.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }

}