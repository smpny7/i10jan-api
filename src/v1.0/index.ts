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
            console.log(err)
            res.status(500).json({
                success: false,
                msg: 'Could not get from database'
            })
        })
})

// -----  QR Scaned Action  ----------------------------------------------------

router.get('/qrScanedAction', (req: express.Request, res: express.Response) => {
    MembersTable.memberExistCheck(req.query.member_key as string)
        .then(data => {
            if (data) {
                MembersTable.leaveCheck(req.query.member_key as string)
                    .then(data => {
                        if (data) {
                            MembersTable.exit(data as number)
                                .then(data => {
                                    res.json({
                                        success: true,
                                        member: true,
                                        left: true
                                    })
                                })
                                .catch(err => {
                                    console.log("[Exit]" + err)
                                    res.status(500).json({
                                        success: false,
                                        msg: 'Could not get from database'
                                    })
                                })
                        } else {
                            res.json({
                                success: true,
                                member: true,
                                left: false
                            })
                        }
                    })
                    .catch(err => {
                        console.log("[Leave Check]" + err)
                        res.status(500).json({
                            success: false,
                            msg: 'Could not get from database'
                        })
                    })
            } else {
                res.json({
                    success: true,
                    member: false,
                    left: false
                })
            }
        })
        .catch(err => {
            console.log("[Member Exist Check]" + err)
            res.status(500).json({
                success: false,
                msg: 'Could not get from database'
            })
        })
})

module.exports = router
