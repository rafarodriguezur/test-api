import db from '../db';

export class FacilityModel {

  static async getAllByService (serviceId: number) {
    let result = null
    try {
      result = await db.query(
       `select hf.id, hf.health_facility_name as name, hf.address, f.url 
       from health_facilities hf 
       inner join health_facilities_service_categories_links hfscl on hf.id = hfscl.health_facility_id
       inner join files_related_morphs frm on hf.id = frm.related_id
       inner join files f on f.id = frm.file_id 
       where hfscl.service_category_id = $1
       and frm.related_type = 'api::health-facility.health-facility';`, [serviceId]
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    // no services found
    if (result?.rows.length === 0) return []

    return result?.rows
  }
}