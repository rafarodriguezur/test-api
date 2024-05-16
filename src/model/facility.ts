import db from '../db';

export class FacilityModel {

  static async getAllByService (serviceId: number, latitude: number, longitude: number) {
    let result = null
    try {
      result = await db.query(
       `SELECT hf.id, hf.health_facility_name AS name, hf.address, f.url,
          ROUND((6371000 * acos(cos(radians($1)) * cos(radians(hf.latitude)) * 
          cos(radians(hf.longitude) - radians($2)) + sin(radians($1)) * 
          sin(radians(hf.latitude))))::NUMERIC, 2) AS distance
        FROM health_facilities hf
        INNER JOIN health_facilities_service_categories_links hfscl ON hf.id = hfscl.health_facility_id
        INNER JOIN files_related_morphs frm ON hf.id = frm.related_id
        INNER JOIN files f ON f.id = frm.file_id 
        WHERE hfscl.service_category_id = $3
        AND frm.related_type = 'api::health-facility.health-facility'
        ORDER BY
          distance ASC;`, [latitude, longitude, serviceId]
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    // no services found
    if (result?.rows.length === 0) return []

    return result?.rows
  }
}