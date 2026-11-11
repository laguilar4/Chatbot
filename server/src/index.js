import { env } from './config/env.js';
import { pool, checkDbConnection } from './config/db.js';
import { app } from './app.js';

async function main() {
  try {
    await checkDbConnection();
    console.log('✅ Conectado a MySQL');
  } catch (err) {
    console.error('❌ No se pudo conectar a MySQL:', err.message);
    process.exit(1);
  }

  const server = app.listen(env.PORT, () => {
    console.log(`🚀 API escuchando en http://localhost:${env.PORT}`);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} recibido, cerrando...`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main();
