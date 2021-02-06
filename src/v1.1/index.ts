import express from 'express'
import {MembersTable, ClubTable, PersonalTable} from './dbManager'

require('dotenv').config();

const router = express.Router()

// -----  Web Site  ------------------------------------------------------------

router.get('/', (req: express.Request, res: express.Response) => {
    MembersTable.getInRoomNumber()
        .then(result => {
            res.render('index', { members: result as number })
        })
        .catch(err => {
            console.log("[Web Site]" + err)
            res.status(500).send('データベースとの通信に失敗しました')
        })
})

// -----  API  -----------------------------------------------------------------

router.get('/api', (req: express.Request, res: express.Response) => {
    MembersTable.getInRoomData()
        .then(result => {
            res.json({
                success: true,
                data: result
            })
        })
        .catch(err => {
            console.log("[API]" + err)
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


// -----  [CLUB] QR Scanned Action  --------------------------------------------

router.post('/club/qrScannedAction', (req: express.Request, res: express.Response) => {
    MembersTable.memberExistCheck(req.query.member_key as string)
        .then(data => {
            if (data) {
                ClubTable.leaveCheck(req.query.member_key as string)
                    .then(data => {
                        if (data) {
                            ClubTable.exit(data as number)
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


// -----  [CLUB] Register Action  ----------------------------------------------

router.post('/club/registerAction', (req: express.Request, res: express.Response) => {
    ClubTable.register(req.query.member_key as string, parseFloat(req.query.body_temperature as string), req.query.physical_condition as string, req.query.stifling as string, req.query.fatigue as string)
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
            console.log("[Club:RegisterAction]" + err)
            res.status(500).json({
                success: false,
                msg: 'Could not get from database'
            })
        })
})


// -----  [PERSONAL] Member Select Action  -------------------------------------

router.get('/personal/memberSelectAction', (req: express.Request, res: express.Response) => {
    PersonalTable.getAllMembers()
        .then(result => {
            res.json({
                success: true,
                data: result
            })
        })
        .catch(err => {
            console.log("[Personal:MemberSelectAction]" + err)
            res.status(500).json({
                success: false,
                msg: 'Could not get from database'
            })
        })
})


// -----  [PERSONAL] Input Temperature Action  ---------------------------------

router.get('/personal/inputTemperatureAction', (req: express.Request, res: express.Response) => {
    PersonalTable.getMemberKey(req.query.member_key as string)
        .then(result => {
            res.json({
                success: true,
                data: result
            })
        })
        .catch(err => {
            console.log("[Personal:InputTemperatureAction]" + err)
            res.status(500).json({
                success: false,
                msg: 'Could not get from database'
            })
        })
})


// -----  [PERSONAL] Register Action  ------------------------------------------

router.post('/personal/registerAction', (req: express.Request, res: express.Response) => {
    PersonalTable.register(req.query.member_key as string, parseFloat(req.query.body_temperature as string))
        .then(() => {
            res.json({
                success: true
            })
        })
        .catch(err => {
            console.log("[Personal:RegisterAction]" + err)
            res.status(500).json({
                success: false,
                msg: 'Could not get from database'
            })
        })
})


module.exports = router
