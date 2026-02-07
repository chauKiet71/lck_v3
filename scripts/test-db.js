const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

async function testConnection() {
    const connectionString = process.env.DATABASE_URL;
    console.log("Testing connection string:", connectionString ? "Defined" : "Undefined");

    if (!connectionString) {
        console.error("DATABASE_URL is not defined in .env");
        return;
    }

    const pool = new Pool({
        connectionString: connectionString,
    });

    try {
        const client = await pool.connect();
        console.log("Successfully connected to the database!");
        const res = await client.query('SELECT NOW()');
        console.log("Current DB Time:", res.rows[0]);
        client.release();
    } catch (err) {
        console.error("Connection error:", err);
    } finally {
        await pool.end();
    }
}

testConnection();
