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
}