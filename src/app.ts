import express from 'express'

require('dotenv').config()

const app: express.Express = express()
const router1_0: express.Router = require('./v1.0/')
const router1_1: express.Router = require('./v1.1/')

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/v1.0/', router1_0)
app.use('/v1.1/', router1_1)
app.use('/public', express.static(__dirname + '/../public'))

app.set('view engine', 'ejs')
app.listen(process.env.PORT || 80, () => {
    console.log('[INFO] Listening on port ' + (process.env.PORT || 80) + '...')
})
