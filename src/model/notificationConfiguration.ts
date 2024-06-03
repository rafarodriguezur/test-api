import db from '../db';

export class NotificationConfigurationModel {

  static async getNotificationsConfiguration() {
    let result = null
    try {
      result = await db.query(
       `select nc.hour 
       from notification_configurations nc
       order by nc.hour limit 1`
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return null

    return result?.rows[0]
  }
}