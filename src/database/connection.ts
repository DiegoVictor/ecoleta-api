import knex from 'knex';

import database from '../config/database';

const connection = knex(database);

export default connection;
