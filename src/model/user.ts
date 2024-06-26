import db from '../db';

export class UserModel {

  static async save(input: any) {

    const {
      deviceId,
      age,
      gender,
      deviceModel,
      osVersion
    } = input

    try {
        const userRows = await db.query(
        `select u.mac_address, u.age, u.gender, u.device_model, u.os_version, u.is_blocked
        from users u where u.mac_address = $1;`, [deviceId]
       )
       if (userRows?.rows.length === 0) {
        const result = await db.query(
          `INSERT INTO users(mac_address, age, gender, device_model, os_version)
          VALUES ($1, $2, $3, $4, $5) RETURNING mac_address, age, gender, device_model, os_version, is_blocked;`,
          [deviceId, age, gender, deviceModel, osVersion]
        )
        return result.rows[0]
       } else {
          await db.query(`UPDATE users SET age = $2, gender = $3, updated_at = CURRENT_TIMESTAMP WHERE mac_address = $1`, [deviceId, age, gender])
          return userRows.rows[0]
       }
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }

  static async updateToken(input: any) {

    const {token, deviceId } = input;
    
    try {
      const findUserRows = await db.query(
        `select u.mac_address
        from users u where u.mac_address = $1;`, [deviceId]
       )
       if (findUserRows.rows.length > 0) {
        const userRows = await db.query(`UPDATE users SET token = $2, updated_at = CURRENT_TIMESTAMP WHERE mac_address = $1 RETURNING mac_address;`, [deviceId, token])
        return userRows.rows[0]
       } else {
        return {error: true}
       }
      
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }
}