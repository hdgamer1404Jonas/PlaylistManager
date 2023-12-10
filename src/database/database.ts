import mysql from 'mysql2/promise';

const config = require('../../config.json');

let connection: mysql.Connection;


async function connect() {
    connection = await mysql.createConnection({
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database
    });

    console.log("Connected to database");
}

async function getConnection() {
    if (!connection) {
        await connect();
    }

    await checkConnection();

    return connection;
}

async function checkConnection() {
    try {
        await connection.query("SELECT 1");
    } catch (e) {
        await connect();
    }
}

export {
    getConnection,
    connect
}

export * from './modules/checkInsUser';