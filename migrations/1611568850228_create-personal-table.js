/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('personal', {
        id: 'id',
        member_key: {
            type: 'string',
            notNull: true,
        },
        nick_name: {
            type: 'string',
            notNull: true,
        },
        full_name: {
            type: 'string',
            notNull: true,
        },
        body_temperature: {
            type: 'double precision',
            notNull: true,
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

exports.down = pgm => {
    pgm.dropTable('personal')
};
