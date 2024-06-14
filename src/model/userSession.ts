import db from '../db';

export class UserSessionModel {

  static async save(input: any) {

    const { deviceId } = input

    try {
        const result = await db.query(
          `INSERT INTO user_sessions(mac_address, app_id, session_start_time)
          VALUES ($1, 1, current_timestamp) RETURNING mac_address;`,
          [deviceId]
        )
        return result.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }

}