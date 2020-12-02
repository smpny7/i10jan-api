import express from 'express'
import {MembersTable, DataTable} from './dbManager'

require('dotenv').config();

const router = express.Router()

// -----  Web Site  ------------------------------------------------------------

router.get('/', (req: express.Request, res: express.Response) => {
    MembersTable.getInRoomData()
        .then(result => {
            res.json({
                success: true,
                data: result
            })
        })
        .catch(err => {
            console.log("[Web Site]" + err)
            res.status(500).json({
                success: false,
                msg: 'Could not get from database'
            })
        })
})


// -----  Daily Action  --------------------------------------------------------

router.get('/dailyAction', (req: express.Request, res: express.Response) => {
    if (new Date().getHours() == 22) {
        MembersTable.setAllMemberOutRoom()
            .then(() => {
                res.json({
                    success: true,
                    done: true
                })
            })
            .catch(err => {
                console.log("[Daily Action]" + err)
                res.status(500).json({
                    success: false,
                    msg: 'Could not get from database'
                })
            })
    } else {
        res.json({
            success: true,
            done: false
        })
    }
})


// -----  QR Scanned Action  ---------------------------------------------------

router.post('/qrScannedAction', (req: express.Request, res: express.Response) => {
    MembersTable.memberExistCheck(req.query.member_key as string)
        .then(data => {
            if (data) {
                DataTable.leaveCheck(req.query.member_key as string)
                    .then(data => {
                        if (data) {
                            DataTable.exit(data as number)
                                .then(() => {
                                    res.json({
                                        success: true,
                                        member: true,
                                        left: true
                                    })
                                    MembersTable.setOutRoom(req.query.member_key as string)
                                        .catch(err => {
                                            console.log("[SetOutRoom]" + err)
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

// -----  Register Action  -----------------------------------------------------

router.post('/registerAction', (req: express.Request, res: express.Response) => {
    DataTable.register(req.query.member_key as string, parseInt(req.query.body_temperature as string), req.query.physical_condition as string, req.query.stifling as string, req.query.fatigue as string, req.query.remarks as string)
        .then(() => {
            res.json({
                success: true
            })
            MembersTable.setInRoom(req.query.member_key as string)
                .catch(err => {
                    console.log("[SetInRoom]" + err)
                })
        })
        .catch(err => {
            console.log("[RegisterAction]" + err)
            res.status(500).json({
                success: false,
                msg: 'Could not get from database'
            })
        })
})

module.exports = router
