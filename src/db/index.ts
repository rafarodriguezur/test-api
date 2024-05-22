import pg from 'pg'

const db = new pg.Pool({
    host: process.env.DB_HOST ?? 'roundhouse.proxy.rlwy.net',
    port: process.env.DB_PORT as unknown as number ?? 42579,
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'HurPkrCULPjwnIsSuLjrDemaFKKgNTWy',
    database: process.env.DB_NAME ?? 'railway',
});

export default db;