import db from '../db';

export class NotificationModel {

  static async save(input: any) {

    const {
      deviceId,
      healthFacilityId,
      healthFacilityName,
      notificationToken,
      status
    } = input

    console.log('deviceId', deviceId)

    try {
        const notificationRows = await db.query(
        `SELECT n.notification_id
        	FROM notifications n where n.mac_address = $1 and n.health_facility_id = $2 and n.status = 0;`, [deviceId, healthFacilityId]
       )
       if (notificationRows?.rows.length === 0) {
        const result = await db.query(
          `INSERT INTO notifications(mac_address, health_facility_id, health_facility_name, notification_token, status, registration_date, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING mac_address;`,
          [deviceId, healthFacilityId, healthFacilityName, notificationToken, status, new Date(), new Date(), new Date()]
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
       WHERE CURRENT_TIMESTAMP - n.registration_date > interval '${hours} hours' AND n.status = 0;`
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return []

    return result?.rows
  }


}