const express = require('express')
const app = express()
const db = require('./config/mongoose-connection')
const userRouter = require('./routes/userRouter')
const classRouter = require('./routes/classRouter')
const attendenceRouter = require('./routes/attendenceRouter')
const marksRouter = require('./routes/marksRouter')
const cookieParser = require('cookie-parser')

const cors = require('cors')
require('dotenv').config()


app.use(express.json())

app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors(
    {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}
))

app.use('/', userRouter)
app.use('/class', classRouter)
app.use('/attendence', attendenceRouter)
app.use('/marks', marksRouter)

app.listen(5000)