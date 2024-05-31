import express, { json } from 'express'
import serviceRouter  from './routes/service'
import userRouter from './routes/user'
import facilityRouter from './routes/facility'
import notificationRouter from './routes/notification'
import surveyQuestion from './routes/surveyQuestion'
import satisfactionSurvey from './routes/satisfactionSurvey'


import cors from 'cors'
import 'dotenv/config'

const app = express()
app.use(json())
app.use(cors())
app.disable('x-powered-by')

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use('/api/services', serviceRouter)
app.use('/api/users', userRouter)
app.use('/api/facilities', facilityRouter)
app.use('/api/notifications', notificationRouter)
app.use('/api/survey-question', surveyQuestion)
app.use('/api/satisfaction-survey', satisfactionSurvey)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})