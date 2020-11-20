require('dotenv').config()

const pg = require("pg")
const database_url = process.env.DATABASE_URL
const pgPool = new pg.Pool({ database_url })

// =====  MEMBERS TABLE  =======================================================

export class MembersTable {
    static async getAllMembers() {
        return new Promise((resolve, reject) => {
            var query = {
                text: 'SELECT nickname, in_room FROM members WHERE active = $1',
                values: [true],
            }
            pgPool.connect(function (err: any, client: any) {
                if (err) {
                    return reject(err)
                } else {
                    client.query(query, function (err: any, result: any) {
                        if (err)
                            return reject(err)
                        return resolve(result.rows)
                    })
                }
            })
        })
    }

    static async memberExistCheck(member_key: string) {
        return new Promise((resolve, reject) => {
            var query = {
                text: 'SELECT nickname FROM members WHERE active = $1 AND member_key = $2',
                values: [true, member_key],
            }
            pgPool.connect(function (err: any, client: any) {
                if (err) {
                    return reject(err)
                } else {
                    client.query(query, function (err: any, result: any) {
                        if (err)
                            return reject(err)
                        return resolve(result.rows.length != 0)
                    })
                }
            })
        })
    }

    static async leaveCheck(member_key: string) {
        return new Promise((resolve, reject) => {
            var query = {
                text: 'SELECT id, out_time FROM data WHERE member_key = $1 ORDER BY id DESC',
                values: [member_key],
            }
            pgPool.connect(function (err: any, client: any) {
                if (err) {
                    return reject(err)
                } else {
                    client.query(query, function (err: any, result: any) {
                        if (err)
                            return reject(err)
                        if (result.rows[0] == undefined || result.rows[0].out_time != null)
                            return resolve(0)
                        else
                            return resolve(result.rows[0].id)
                    })
                }
            })
        })
    }

    static async exit(id: number) {
        return new Promise((resolve, reject) => {
            var query = {
                text: 'UPDATE data SET out_time = $1 WHERE id = $2',
                values: [new Date(), id],
            }
            pgPool.connect(function (err: any, client: any) {
                if (err) {
                    return reject(err)
                } else {
                    client.query(query, function (err: any, result: any) {
                        if (err)
                            return reject(err)
                        if (result.rows[0] == undefined || result.rows[0].out_time != null)
                            return resolve(false)
                        else
                            return resolve(true)
                    })
                }
            })
        })
    }
}
// =============================================================================
