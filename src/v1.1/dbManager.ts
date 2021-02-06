import {Client, QueryResult} from "pg";

require('dotenv').config()

const connectionString = process.env.DATABASE_URL;

// =====  MEMBERS TABLE  =======================================================

export class MembersTable {
    static async memberExistCheck(member_key: string) {
        return new Promise((resolve, reject) => {
            const client = new Client({
                connectionString: connectionString,
            })
            const query = {
                text: 'SELECT nick_name FROM members WHERE active = $1 AND member_key = $2',
                values: [true, member_key],
            }
            client.connect()
            client.query(query, (err:Error, result:QueryResult) => {
                client.end()
                if (err)
                    return reject(err)
                return resolve(result.rows.length != 0)
            })
        })
    }

    static async getInRoomNumber() {
        return new Promise((resolve, reject) => {
            const client = new Client({
                connectionString: connectionString,
            })
            const query = {
                text: 'SELECT nick_name FROM members WHERE active = $1 AND in_room = $2',
                values: [true, true],
            }
            client.connect()
            client.query(query, (err:Error, result:QueryResult) => {
                client.end()
                if (err)
                    return reject(err)
                return resolve(result.rows.length)
            })
        })
    }

    static async getInRoomData() {
        return new Promise((resolve, reject) => {
            const client = new Client({
                connectionString: connectionString,
            })
            const query = {
                text: 'SELECT nick_name FROM members WHERE active = $1 AND in_room = $2',
                values: [true, true],
            }
            client.connect()
            client.query(query, (err:Error, result:QueryResult) => {
                client.end()
                if (err)
                    return reject(err)
                return resolve(result.rows)
            })
        })
    }

    static async getMemberSecretData(member_key: string) {
        return new Promise((resolve, reject) => {
            const client = new Client({
                connectionString: connectionString,
            })
            const query = {
                text: 'SELECT nick_name, full_name FROM members WHERE member_key = $1',
                values: [member_key],
            }
            client.connect()
            client.query(query, (err:Error, result:QueryResult) => {
                client.end()
                if (err)
                    return reject(err)
                return resolve(result.rows[0])
            })
        })
    }

    static async setInRoom(member_key: string) {
        return new Promise((resolve, reject) => {
            const client = new Client({
                connectionString: connectionString,
            })
            const query = {
                text: 'UPDATE members SET in_room = true, updated_at = $1 WHERE member_key = $2',
                values: [new Date(), member_key],
            }
            client.connect()
            client.query(query, (err:Error) => {
                client.end()
                if (err)
                    return reject(err)
                return resolve(null)
            })
        })
    }

    static async setOutRoom(member_key: string) {
        return new Promise((resolve, reject) => {
            const client = new Client({
                connectionString: connectionString,
            })
            const query = {
                text: 'UPDATE members SET in_room = false, updated_at = $1 WHERE member_key = $2',
                values: [new Date(), member_key],
            }
            client.connect()
            client.query(query, (err:Error) => {
                client.end()
                if (err)
                    return reject(err)
                return resolve(null)
            })
        })
    }

    static async setAllMemberOutRoom() {
        return new Promise((resolve, reject) => {
            const client = new Client({
                connectionString: connectionString,
            })
            const query = {
                text: 'UPDATE members SET in_room = false',
            }
            client.connect()
            client.query(query, (err:Error) => {
                client.end()
                if (err)
                    return reject(err)
                return resolve(null)
            })
        })
    }
}

// =============================================================================


// =====  CLUB TABLE  ==========================================================

export class ClubTable {
    static async leaveCheck(member_key: string) {
        return new Promise((resolve, reject) => {
            const client = new Client({
                connectionString: connectionString,
            })
            const query = {
                text: 'SELECT id, in_time, out_time FROM club WHERE member_key = $1 ORDER BY id DESC',
                values: [member_key],
            }
            client.connect()
            client.query(query, (err:Error, result:QueryResult) => {
                client.end()
                if (err)
                    return reject(err)
                if (result.rows[0] == undefined || result.rows[0].out_time != null || result.rows[0].in_time.getDate() != new Date().getDate())
                    return resolve(0)
                else
                    return resolve(result.rows[0].id)
            })
        })
    }

    static async exit(id: number) {
        return new Promise((resolve, reject) => {
            const client = new Client({
                connectionString: connectionString,
            })
            const query = {
                text: 'UPDATE club SET out_time = $1 WHERE id = $2',
                values: [new Date(), id],
            }
            client.connect()
            client.query(query, (err:Error, result:QueryResult) => {
                client.end()
                if (err)
                    return reject(err)
                if (result.rows[0] == undefined || result.rows[0].out_time != null)
                    return resolve(false)
                else
                    return resolve(true)
            })
        })
    }

    static async register(member_key: string, body_temperature: number, physical_condition: string, stifling: string, fatigue: string) {
        return new Promise((resolve, reject) => {
            MembersTable.getMemberSecretData(member_key)
                .then(result => {
                    type Result = {
                        nick_name: string;
                        full_name: string;
                    }
                    const client = new Client({
                        connectionString: connectionString,
                    })
                    const query = {
                        text: 'INSERT INTO club (member_key, nick_name, full_name, body_temperature, physical_condition, stifling, fatigue, in_time) values($1, $2, $3, $4, $5, $6, $7, $8)',
                        values: [member_key, (result as Result).nick_name, (result as Result).full_name, body_temperature, physical_condition, stifling, fatigue, new Date()],
                    }
                    client.connect()
                    client.query(query, (err:Error) => {
                        client.end()
                        if (err)
                            return reject(err)
                        return resolve(null)
                    })
                })
                .catch(err => {
                    return reject(err)
                })
        })
    }
}

// =============================================================================


// =====  PERSONAL TABLE  ======================================================

export class PersonalTable {
    static async getAllMembers() {
        return new Promise((resolve, reject) => {
            const client = new Client({
                connectionString: connectionString,
            })
            const query = {
                text: 'SELECT nick_name, member_key FROM members WHERE active = true',
            }
            client.connect()
            client.query(query, (err:Error, result:QueryResult) => {
                client.end()
                if (err)
                    return reject(err)
                else
                    return resolve(result.rows)
            })
        })
    }

    static async getMemberKey(member_key: string) {
        return new Promise((resolve, reject) => {
            const client = new Client({
                connectionString: connectionString,
            })
            const query = {
                text: 'SELECT nick_name FROM members WHERE member_key = $1',
                values: [member_key],
            }
            client.connect()
            client.query(query, (err:Error, result:QueryResult) => {
                client.end()
                if (err)
                    return reject(err)
                else
                    return resolve(result.rows[0].nick_name)
            })
        })
    }

    static async register(member_key: string, body_temperature: number) {
        return new Promise((resolve, reject) => {
            MembersTable.getMemberSecretData(member_key)
                .then(result => {
                    type Result = {
                        nick_name: string;
                        full_name: string;
                    }
                    const client = new Client({
                        connectionString: connectionString,
                    })
                    const query = {
                        text: 'INSERT INTO personal (member_key, nick_name, full_name, body_temperature) values($1, $2, $3, $4)',
                        values: [member_key, (result as Result).nick_name, (result as Result).full_name, body_temperature],
                    }
                    client.connect()
                    client.query(query, (err:Error) => {
                        client.end()
                        if (err)
                            return reject(err)
                        return resolve(null)
                    })
                })
                .catch(err => {
                    return reject(err)
                })
        })
    }
}

// =============================================================================
