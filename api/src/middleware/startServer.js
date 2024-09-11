import models from '../models/index.js';
import { PORT } from '../config/config.js';

const { DB_FORCE_RESTART, ENV } = process.env;
async function syncDatabase() {
    console.info('SETUP - Sincronizando tablas de la base de datos...');
    const sequelizeOptions = {};
	console.info('ENV', DB_FORCE_RESTART, ENV );
    if (DB_FORCE_RESTART === 'true' && ENV !== 'production') {
		console.info('SETUP - Creando tablas');
		// sequelizeOptions.alter = true;
        // sequelizeOptions.force = true;
    }

    await models.sequelize.sync(sequelizeOptions);
    console.info('INFO - Base de datos sincronizada correctamente.');
}
export async function startServer(httpServer) {
    try {
        await syncDatabase();
        await iniciarServidor(httpServer);
    } catch (error) {
        console.error('ERROR - Iniciando servidor falló:', error);
        process.exit(1);
    }
}
async function iniciarServidor(server) {
    console.info('SETUP - Iniciando servidor...');
    server.listen({ port: PORT }, (error) => {
        if (error) {
            console.error('ERROR - Error al iniciar el servidor:', error);
            process.exit(1);
        }
        console.info(`INFO - Servidor corriendo en el puerto ${ PORT }.`);
    });
}
