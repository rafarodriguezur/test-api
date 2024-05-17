import db from '../db';

export class FacilityModel {

  static async getAllByService (serviceId: number, latitude: number, longitude: number, page: number) {
    let result = null;
    let resultCount = null;
    try {
      resultCount = await db.query(
        `SELECT COUNT(hf.id) AS total
         FROM health_facilities hf
         INNER JOIN health_facilities_service_categories_links hfscl ON hf.id = hfscl.health_facility_id
         INNER JOIN files_related_morphs frm ON hf.id = frm.related_id
         INNER JOIN files f ON f.id = frm.file_id
         WHERE hfscl.service_category_id = $1
         AND frm.related_type = 'api::health-facility.health-facility';`, [serviceId]
       )

      result = await db.query(
       `SELECT hf.id, hf.health_facility_name AS name, hf.address, f.url,
          COUNT(hfss.survey_id) as opinions, AVG(hfss.answer)::numeric(10,2) as average,
          ROUND((6371000 * acos(cos(radians($1)) * cos(radians(hf.latitude)) * 
          cos(radians(hf.longitude) - radians($2)) + sin(radians($1)) * 
          sin(radians(hf.latitude))))::NUMERIC, 2) AS distance
        FROM health_facilities hf
        INNER JOIN health_facilities_service_categories_links hfscl ON hf.id = hfscl.health_facility_id
        INNER JOIN files_related_morphs frm ON hf.id = frm.related_id
        INNER JOIN files f ON f.id = frm.file_id
        LEFT JOIN health_facility_satisfaction_surveys hfss on hf.id = hfss.health_facility_id
        WHERE hfscl.service_category_id = $3
        AND frm.related_type = 'api::health-facility.health-facility'
        GROUP BY 
          hf.id, f.url
        ORDER BY
          distance ASC
        LIMIT 5 OFFSET (5 * ($4 - 1));`, [latitude, longitude, serviceId, page]
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return []

    return {total: resultCount?.rows[0].total, items: result?.rows}
  }

  static async getAllByServiceOrderByName (serviceId: number, page: number) {
    let result = null;
    let resultCount = null;
    try {
      resultCount = await db.query(
        `SELECT COUNT(hf.id) AS total
         FROM health_facilities hf
         INNER JOIN health_facilities_service_categories_links hfscl ON hf.id = hfscl.health_facility_id
         INNER JOIN files_related_morphs frm ON hf.id = frm.related_id
         INNER JOIN files f ON f.id = frm.file_id
         WHERE hfscl.service_category_id = $1
         AND frm.related_type = 'api::health-facility.health-facility';`, [serviceId]
       )

      result = await db.query(
       `SELECT hf.id, hf.health_facility_name AS name, hf.address, f.url,
          COUNT(hfss.survey_id) as opinions, AVG(hfss.answer)::numeric(10,2) as average
        FROM health_facilities hf
        INNER JOIN health_facilities_service_categories_links hfscl ON hf.id = hfscl.health_facility_id
        INNER JOIN files_related_morphs frm ON hf.id = frm.related_id
        INNER JOIN files f ON f.id = frm.file_id
        LEFT JOIN health_facility_satisfaction_surveys hfss on hf.id = hfss.health_facility_id
        WHERE hfscl.service_category_id = $1
        AND frm.related_type = 'api::health-facility.health-facility'
        GROUP BY 
          hf.id, f.url
        ORDER BY
          name
        LIMIT 5 OFFSET (5 * ($2 - 1));`, [serviceId, page]
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return []

    return {total: resultCount?.rows[0].total, items: result?.rows}
  }
}