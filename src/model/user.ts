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

    console.log('deviceId', deviceId)

    try {
        const userRows = await db.query(
        `select u.mac_address, u.age, u.gender, u.device_model, u.os_version
        from users u where u.mac_address = $1;`, [deviceId]
       )
       if (userRows?.rows.length === 0) {
        const result = await db.query(
          `INSERT INTO users(mac_address, age, gender, device_model, os_version, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING mac_address, age, gender, device_model, os_version;`,
          [deviceId, age, gender, deviceModel, osVersion, new Date(), new Date()]
        )
        return result.rows[0]
       } else {
          await db.query(`UPDATE users SET age = $2, gender = $3, updated_at = $4 WHERE mac_address = $1`, [deviceId, age, gender, new Date()])
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
        const userRows = await db.query(`UPDATE users SET token = $2, updated_at = $3 WHERE mac_address = $1 RETURNING mac_address;`, [deviceId, token, new Date()])
        return userRows.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }
}