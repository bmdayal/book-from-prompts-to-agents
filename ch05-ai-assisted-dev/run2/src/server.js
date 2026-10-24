const { loadConfig } = require('./config');
const { createPool } = require('./db');
const { createApp } = require('./app');

const config = loadConfig();
const app = createApp({ pool: createPool(config.databaseUrl), config });
app.listen(config.port, () => console.log(`Listening on ${config.port}`));
