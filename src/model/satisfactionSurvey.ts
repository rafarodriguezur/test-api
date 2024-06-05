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
          [deviceId, healthFacilityId, comment, isPublic, false, answerId, new Date(), new Date()])
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

}