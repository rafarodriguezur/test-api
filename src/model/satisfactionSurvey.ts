import db from '../db';

export class SatisfactionSurveyModel {

  static async save (input: any) {

    let value = '';
    input.questions.forEach((question: any, index: number) => {
      if (index < input.questions.length - 1) {
        value += `('${input.deviceId}', ${input.healthFacilityId}, ${question.id}, ${question.star}, current_timestamp, current_timestamp),`
      } else {
        value += `('${input.deviceId}', ${input.healthFacilityId}, ${question.id}, ${question.star}, current_timestamp, current_timestamp)`
      }
    });

    try {
        const result = await db.query(
          `INSERT INTO health_facility_satisfaction_surveys(mac_address, health_facility_id, question_id, answer, created_at, updated_at)
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
    } = input

    try {
        const result = await db.query(
          `INSERT INTO health_facility_satisfaction_survey_comments(mac_address, health_facility_id, comment, public, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [deviceId, healthFacilityId, comment, isPublic, new Date(), new Date()])
        return result.rows[0]
    } catch (e) {
      console.log('error', e)
      return {error: e}
    }
  }


}