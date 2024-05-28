import db from '../db';

export class NotificationModel {

  static async save (input: any) {

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
        	FROM notifications n where n.mac_address = $1 and n.health_facility_id = $2 and status = 0;`, [deviceId, healthFacilityId]
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
}