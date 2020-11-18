/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('data', {
        id: 'id',
        member_key: {
            type: 'string',
            notNull: true,
        },
        nickname: {
            type: 'string',
            notNull: true,
        },
        fullname: {
            type: 'string',
            notNull: true,
        },
        body_temperature: {
            type: 'double precision',
            notNull: true,
        },
        physical_condition: {
            type: 'string',
            notNull: true,
        },
        stifling: {
            type: 'string',
            notNull: true,
        },
        fatigue: {
            type: 'string',
            notNull: true,
        },
        remarks: {
            type: 'string',
            default: null
        },
        in_time: {
            type: 'timestamp',
            notNull: true,
        },
        out_time: {
            type: 'timestamp',
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
};

exports.down = pgm => { 'data' };
