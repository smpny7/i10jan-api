require('dotenv').config()

const pg = require("pg")
const database_url = process.env.DATABASE_URL
const pgPool = new pg.Pool({database_url})

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
                    console.log(err)
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
}
// =============================================================================
