import express from 'express'

const app: express.Express = express()
require('dotenv').config()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const router1_0: express.Router = require('./v1.0/')

app.use('/v1.0/', router1_0)
app.listen(process.env.PORT || 80, () => { console.log('[INFO] Listening on port ' + (process.env.PORT || 80) + '...') })
