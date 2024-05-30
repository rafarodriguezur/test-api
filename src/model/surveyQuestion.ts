import db from '../db';

export class SurveyQuestionModel {

  static async getAll () {
    let result = null
    try {
      result = await db.query(
       `SELECT hfssq.question_text
        FROM health_facility_satisfaction_survey_questions hfssq
        ORDER BY hfssq.question_text ;`
      )
    } catch (error) {
      console.log(`error: ${error}`)
    }
    
    // no services found
    if (result?.rows.length === 0) return []

    return result?.rows
  }
}