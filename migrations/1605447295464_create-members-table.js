/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('members', {
        member_key: {
            type: 'string',
            notNull: true,
            unique: true
        },
        nickname: {
            type: 'string',
            notNull: true,
        },
        fullname: {
            type: 'string',
            notNull: true,
        },
        active: {
            type: 'boolean',
            notNull: true,
            default: true
        },
        in_room: {
            type: 'boolean',
            notNull: true,
            default: false
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
}

exports.down = pgm => { 'members' }
