const { Pool } = require('pg');
const { getConfig } = require('./config');
const { createApp } = require('./app');
const { createUserRepository } = require('./repositories/userRepository');

const config = getConfig();
const pool = new Pool({ connectionString: config.databaseUrl });
const app = createApp({ userRepository: createUserRepository(pool), config });

app.listen(config.port, () => console.log(`Listening on ${config.port}`));
