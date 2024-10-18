import models from '../models/index.js';
import { PORT } from '../config/config.js';
import { initializeModule } from '../scripts/initializeModule.js';
const { DB_FORCE_RESTART, ENV } = process.env;

async function syncDatabase() {
    if (DB_FORCE_RESTART === 'true' && ENV !== 'production') {
        console.info('SETUP - Sincronizando tablas de la base de datos...');
        const sequelizeOptions = {
            force: true,  // Evita borrar las tablas existentes
            alter: true   // No realices modificaciones automáticas
        };

        try {
            console.info('INFO - Creando/actualizando tablas según los modelos...');
            await models.sequelize.sync(sequelizeOptions);

            console.info('INFO - Base de datos sincronizada correctamente.');

            // Inserta todos los datos necesarios para desplegar el módulo
            await initializeModule(models);
        } catch (error) {
            console.error('ERROR - Sincronización de base de datos falló:', error);
            throw error;
        }
    } else {
        console.info('INFO - Sincronización de base de datos omitida. DB_FORCE_RESTART está en false o es producción.');
    }
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
        console.info(`INFO - Servidor corriendo en el puerto ${PORT}.`);
    });
}
