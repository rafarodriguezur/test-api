import pg from 'pg'

const db = new pg.Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: 3200,
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'admin',
    database: process.env.DB_NAME ?? 'dr5_starts_youth_db',
});

export default db;