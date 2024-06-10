import db from '../db';

export class UserHealthFacilityVisitModel {

  static async save(input: any) {

    const {
      deviceId,
      healthFacilityId
    } = input

    try {
        const result = await db.query(
          `INSERT INTO user_health_facility_visits(mac_address, health_facility_id, visit_date)
          VALUES ($1, $2, current_timestamp) RETURNING mac_address;`,
          [deviceId, healthFacilityId]
        )
        return result.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }

}