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

  static async getAllFaqsByHealthFacilityId(healthFacilityId: number) {
    let result = null;
    try {
      result = await db.query(
       `SELECT  hf.id, f.question , r.answer 
        FROM health_facility_faqs hff 
        INNER JOIN health_facility_faqs_health_facility_links hffhfl on hff.id = hffhfl.health_facility_faq_id  
        INNER JOIN health_facility_faqs_faq_links hfffl  on hff.id = hfffl.health_facility_faq_id
        INNER JOIN health_facility_faqs_answer_links hffal  on hff.id = hffal.health_facility_faq_id
        INNER JOIN faqs f on hfffl.faq_id  = f.id
        INNER JOIN answers r on hffal.answer_id  = r.id
        INNER JOIN health_facilities hf on hffhfl.health_facility_id  = hf.id
        WHERE hf.id = $1
        ORDER BY f.question;`, [healthFacilityId]
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return []

    return result?.rows
  }

  static async getAllScheduleByHealthFacilityId(healthFacilityId: number) {
    let result = null;
    try {
      result = await db.query(
       `SELECT
        CASE
          WHEN coh.monday = true then 'Lunes'
        END AS monday,
        CASE
          WHEN coh.tuesday  = true then 'Martes'
        END AS tuesday,
        CASE
          WHEN coh.wednesday  = true then 'Miercoles'
        END AS wednesday,
        CASE
          WHEN coh.thursday  = true then 'Jueves'
        END AS thursday,
        CASE
          WHEN coh.friday  = true then 'Viernes'
          END AS friday,
        CASE
          WHEN coh.saturday  = true then 'Sabado'
        END AS saturday,
        CASE
          WHEN coh.sunday  = true then 'Domingo'
        END AS sunday,
        coh.from,
        coh.to
        FROM components_operation_hours coh
        INNER JOIN health_facilities_components hfc on coh.id = hfc.component_id 
        INNER JOIN health_facilities hf on hfc.entity_id = hf.id
        WHERE hfc.component_type = 'operation.hour'
        AND hf.id = $1;`, [healthFacilityId]
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return []

    return result?.rows
  }

  static async getHealthFacilityById(healthFacilityId: number) {
    let result = null;
    try {
      result = await db.query(
       `SELECT hf.id, hf.phone_number as phone, hf.health_facility_name as name, hf.latitude, hf.longitude, AVG(hfss.answer)::numeric(10,2) as average 
        FROM health_facilities hf
        LEFT JOIN health_facility_satisfaction_surveys hfss on hf.id = hfss.health_facility_id
        WHERE hf.id = $1
        GROUP BY hf.id;`, [healthFacilityId]
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return null

    return result?.rows[0]
  }
}