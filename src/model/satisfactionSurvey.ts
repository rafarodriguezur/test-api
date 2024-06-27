import db from '../db';

export class SatisfactionSurveyModel {

  static async save(input: any) {

    let value = '';
    input.questions.forEach((question: any, index: number) => {
      if (index < input.questions.length - 1) {
        value += `('${input.deviceId}', ${input.healthFacilityId}, ${question.id}, ${question.star}, ${input.answerId}, current_timestamp, current_timestamp),`
      } else {
        value += `('${input.deviceId}', ${input.healthFacilityId}, ${question.id}, ${question.star}, ${input.answerId}, current_timestamp, current_timestamp)`
      }
    });

    try {
        const result = await db.query(
          `INSERT INTO health_facility_satisfaction_surveys(mac_address, health_facility_id, question_id, answer, survey_answers_id, created_at, updated_at)
          VALUES ${value} RETURNING mac_address`)
        return result.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }

  static async saveComment(input: any) {

    const {
      deviceId,
      healthFacilityId,
      comment,
      isPublic,
      answerId
    } = input

    try {
        const result = await db.query(
          `INSERT INTO health_facility_satisfaction_survey_comments(mac_address, health_facility_id, comment, public, block, survey_answers_id, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
          [deviceId, healthFacilityId, comment, isPublic, true, answerId, new Date(), new Date()])
        return result.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }

  static async saveSurveyAnswer(input: any)  {
    const {
      deviceId,
      healthFacilityId,
      answerVisit,
      answerServiceAvailable
    } = input

    try {
        const result = await db.query(
          `INSERT INTO health_facility_satisfaction_survey_answers(mac_address, health_facility_id, answer_visit, answer_service_available)
          VALUES ($1, $2, $3, $4) RETURNING survey_answer_id AS id`,
          [deviceId, healthFacilityId, answerVisit, answerServiceAvailable])
        return result.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }

  static async updateSurveyAnswer(input: any)  {
    const {
      surveyAnswerId,
      answerServiceAvailable
    } = input;

    try {
      const result = await db.query(`UPDATE health_facility_satisfaction_survey_answers SET answer_service_available = $2, updated_at = CURRENT_TIMESTAMP WHERE survey_answer_id = $1 RETURNING survey_answer_id as id`, [surveyAnswerId, answerServiceAvailable])
      return result.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }


  static async getRatingPercentage(healthFacilityId: number) {
    let result = null
    try {
      result = await db.query(
       `SELECT hfss.answer, (COUNT(hfss.survey_id)*100/t.total) AS percentage
       FROM health_facility_satisfaction_surveys hfss, 
         (SELECT count('totalanswer') AS total 
         FROM health_facility_satisfaction_surveys hs
         WHERE hs.health_facility_id = $1) AS t
       WHERE hfss.health_facility_id = $1
       GROUP BY hfss.answer, t.total 
       ORDER BY hfss.answer;`, [healthFacilityId]
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return []

    return result?.rows
  }

  static async getComments(healthFacilityId: number, deviceId: string, orderBy: string, order: string, page: number) {
    let result = null;
    let resultCount = null;
    try {
      resultCount = await db.query(
        `SELECT count(hfssa.survey_answer_id) AS total
        FROM health_facility_satisfaction_survey_answers hfssa 
        INNER JOIN health_facility_satisfaction_survey_comments hfssc on hfssc.survey_answers_id = hfssa.survey_answer_id 
        INNER JOIN health_facilities hf on hfssa.health_facility_id = hf.id 
        WHERE  hfssc.block = true
        AND hf.id = $1
        AND (hfssc.mac_address = $2 OR hfssc.public = true)`, [healthFacilityId, deviceId]
       )
      result = await db.query(
       `SELECT hfssa.survey_answer_id AS id, hfssc.comment, AVG(hfss.answer)::numeric(10,1) AS rating,  TO_CHAR(hfssc.created_at::date, 'dd MON yyyy') AS date
       FROM health_facility_satisfaction_survey_answers hfssa 
       INNER JOIN health_facility_satisfaction_survey_comments hfssc ON hfssc.survey_answers_id = hfssa.survey_answer_id 
       INNER JOIN health_facility_satisfaction_surveys hfss ON hfssa.survey_answer_id = hfss.survey_answers_id 
       INNER JOIN health_facilities hf ON hfssa.health_facility_id = hf.id 
       WHERE hfssc.block = true
       AND hf.id = $1
       AND (hfssc.mac_address = $2 OR hfssc.public = true)
       GROUP BY hfssa.survey_answer_id, hfssc.comment, hfssc.created_at
       ORDER BY ${orderBy} ${order}
       LIMIT 5 OFFSET (5 * ($3 - 1));`, [healthFacilityId, deviceId, page]
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return {total: 0, items: []}

    return {total: resultCount?.rows[0].total, items: result?.rows}
  }

  static async commentDetail(surveyAnswerId: number) {
    let result = null
    try {
      result = await db.query(
       `SELECT hfssa.survey_answer_id AS id, hfssc.comment 
       FROM health_facility_satisfaction_survey_answers hfssa
       INNER JOIN health_facility_satisfaction_survey_comments hfssc on hfssa.survey_answer_id = hfssc.survey_answers_id 
       WHERE hfssa.survey_answer_id = $1;`, [surveyAnswerId]
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return []

    return result?.rows
  }

  static async ratingDetail(surveyAnswerId: number) {
    let result = null
    try {
      result = await db.query(
       `SELECT hfssa.survey_answer_id AS id, hfssq.question_text AS question, hfss.answer, hfssa.created_at as date
       FROM health_facility_satisfaction_survey_answers hfssa
       INNER JOIN health_facility_satisfaction_surveys hfss on hfssa.survey_answer_id = hfss.survey_answers_id
       INNER JOIN health_facility_satisfaction_survey_questions hfssq on hfss.question_id = hfssq.id 
       WHERE hfssa.survey_answer_id = $1
       ORDER BY hfssq.question_text;`, [surveyAnswerId]
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return []

    return result?.rows
  }

  static async getHistoryRating(deviceId: string, page: number) {
    let result = null;
    let resultCount = null;
    try {
      resultCount = await db.query(
        `SELECT count(t.total) as total
          FROM (SELECT count(hfssa.survey_answer_id) as total
          FROM health_facilities hf
          INNER JOIN health_facility_satisfaction_survey_answers hfssa on hf.id = hfssa.health_facility_id 
          INNER JOIN health_facility_satisfaction_surveys hfss on hfssa.survey_answer_id = hfss.survey_answers_id
          WHERE hfssa.mac_address = $1
          GROUP BY hfssa.survey_answer_id) as t`, [deviceId]
       )
      result = await db.query(
       `SELECT hfssa.survey_answer_id as id, hf.health_facility_name as name, hf.address, hfss.created_at AS date, t.rating 
        FROM (SELECT hf.id, AVG(hfss.answer)::numeric(10,1) as rating
            FROM health_facilities hf
            INNER JOIN health_facility_satisfaction_survey_answers hfssa on hf.id = hfssa.health_facility_id 
            INNER JOIN health_facility_satisfaction_surveys hfss on hfssa.survey_answer_id = hfss.survey_answers_id
            group BY hf.id
            order BY hf.health_facility_name) as t,
            health_facilities hf
        INNER JOIN health_facility_satisfaction_survey_answers hfssa on hf.id = hfssa.health_facility_id 
        INNER JOIN health_facility_satisfaction_surveys hfss on hfssa.survey_answer_id = hfss.survey_answers_id
        WHERE hfssa.mac_address = $1 and t.id = hf.id
        GROUP BY hf.id, hfssa.survey_answer_id, hf.health_facility_name, hf.address, hfss.created_at, t.rating 
        ORDER BY date desc
        LIMIT 5 OFFSET (5 * ($2 - 1));`, [deviceId, page]
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    if (result?.rows.length === 0) return {total: 0, items: []}

    return {total: resultCount?.rows[0].total, items: result?.rows}
  }

}