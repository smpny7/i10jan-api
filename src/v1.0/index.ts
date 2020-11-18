import express from 'express'
import { MembersTable } from './dbManager'

const router = express.Router()

require('dotenv').config();


// -----  Get All Members  -----------------------------------------------------

router.get('/getAllMembers', (req: express.Request, res: express.Response) => {
    MembersTable.getAllMembers()
        .then(data => {
            res.json({
                success: true,
                version: data
            })
        })
        .catch(err => {
            // ErrorTable.postErrorLog(null, '[license] LicenseTable.getAllLicense()', err)
            // res.status(500).json({
            //     success: false,
            //     msg: 'Could not get from database'
            // })
        })
})

module.exports = router
