import db from '../db';

export class ServiceModel {

  static async getAll () {
    let result = null
    try {
      result = await db.query(
       `select s.id, s.name, s.description, f.url 
        from service_categories s, files f, files_related_morphs frm 
        where frm.related_id = s.id and frm.related_type = 'api::service-category.service-category' and f.id = frm.file_id order by s.name;`
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    // no services found
    if (result?.rows.length === 0) return []

    return result?.rows
  }

  static async saveAccessServiceGlossary(input: any) {
    
    const { deviceId } = input

    try {
        const result = await db.query(
          `INSERT INTO service_categories_accesses(mac_address)
          VALUES ($1) RETURNING mac_address;`,
          [deviceId]
        )
        return result.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }

  static async saveServiceSelection(input: any) {
    
    const { deviceId, serviceId } = input

    try {
        const result = await db.query(
          `INSERT INTO user_service_categories_selections(mac_address, service_category_id, selection_date)
          VALUES ($1, $2, current_timestamp) RETURNING selection_id AS id;`,
          [deviceId, serviceId]
        )
        return result.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }

  static async updateServiceSelection(input: any) {
    
    const { selectionId, healthFacilityId } = input

    try {
        const result = await db.query(
          `UPDATE user_service_categories_selections SET health_facility_id = $2, updated_at = current_timestamp WHERE selection_id = $1 RETURNING selection_id AS id;`,
          [selectionId, healthFacilityId]
        )
        return result.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }

  static async saveHealthFacilitySelection(input: any) {
    
    const { deviceId, healthFacilityId } = input

    try {
        const result = await db.query(
          `INSERT INTO user_health_facility_selections(mac_address, health_facility_id, selection_date)
          VALUES ($1, $2, current_timestamp) RETURNING selection_id AS id;`,
          [deviceId, healthFacilityId]
        )
        return result.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }

  static async updateHealthFacilitySelection(input: any) {
    
    const { selectionId, healthFacilityId } = input

    try {
        const result = await db.query(
          `UPDATE user_health_facility_selections SET health_facility_id = $2, updated_at = current_timestamp WHERE selection_id = $1 RETURNING selection_id AS is;`,
          [selectionId, healthFacilityId]
        )
        return result.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }
}