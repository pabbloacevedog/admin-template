import models from '../models/index.js';
import { PORT } from '../config/config.js';

const { DB_FORCE_RESTART, ENV } = process.env;
async function syncDatabase() {
    console.info('SETUP - Sincronizando tablas de la base de datos...');
    const sequelizeOptions = {};
    console.info('ENV', DB_FORCE_RESTART, ENV);
    if (DB_FORCE_RESTART === 'true' && ENV !== 'production') {
        console.info('SETUP - Creando tablas');
        // sequelizeOptions.alter = true;
        // sequelizeOptions.force = true;
    }
    // sequelizeOptions.alter = true;
    // sequelizeOptions.force = true;
    await models.sequelize.sync(sequelizeOptions);
    // Insertar acciones
    const actions = await Promise.all([
        models.Action.findOrCreate({
            where: { name: 'Create' },
            defaults: { description: '...' }
        }),
        models.Action.findOrCreate({
            where: { name: 'Read' },
            defaults: { description: '...' }
        }),
        models.Action.findOrCreate({
            where: { name: 'Update' },
            defaults: { description: '...' }
        }),
        models.Action.findOrCreate({
            where: { name: 'Delete' },
            defaults: { description: '...' }
        })
    ]);

    // Insertar roles
    const roles = await Promise.all([
        models.Role.findOrCreate({
            where: { name: 'Admin' },
            defaults: { description: '...' }
        }),
        models.Role.findOrCreate({
            where: { name: 'User' },
            defaults: { description: '...' }
        })
    ]);

    // Insertar rutas
    await Promise.all([
        models.Route.findOrCreate({
            where: { path: '/settings' },
            defaults: { name: 'Settings', icon: 'fa-solid fa-sliders' }
        }),
        models.Route.findOrCreate({
            where: { path: '/dashboard' },
            defaults: { name: 'Dashboard', icon: 'fa-solid fa-gauge' }
        })
    ]);



    // Obtener los IDs de los roles y las acciones
    // console.log(roles,'roles')
    // console.log(actions,'actions')
    // const test = actions.find((action, i) => console.log(action[0].name,'action'+i));
    // const test2 = roles.find((role, i) => console.log(role[0].name,'role'+i));

    const adminRole = roles.find(([role]) => role.name === 'Admin')[0];
    const userRole = roles.find(([role]) => role.name === 'User')[0];

    const createAction = actions.find(([action]) => action.name === 'Create')[0];
    const readAction = actions.find(([action]) => action.name === 'Read')[0];
    const updateAction = actions.find(([action]) => action.name === 'Update')[0];
    const deleteAction = actions.find(([action]) => action.name === 'Delete')[0];

    console.log(adminRole.dataValues.role_id,'adminRole')
    // Insertar relaciones en RoleAction

    // Insertar relaciones en RoleAction si no existen
    await Promise.all([
        models.RoleAction.findOrCreate({
            where: { role_id: adminRole.dataValues.role_id, action_id: createAction.dataValues.action_id  }
        }),
        models.RoleAction.findOrCreate({
            where: { role_id: adminRole.dataValues.role_id, action_id: readAction.dataValues.action_id  }
        }),
        models.RoleAction.findOrCreate({
            where: { role_id: adminRole.dataValues.role_id, action_id: updateAction.dataValues.action_id }
        }),
        models.RoleAction.findOrCreate({
            where: { role_id: adminRole.dataValues.role_id, action_id: deleteAction.dataValues.action_id  }
        }),
        models.RoleAction.findOrCreate({
            where: { role_id: userRole.dataValues.role_id, action_id: readAction.dataValues.action_id  }
        })
    ]);

    console.log('Datos iniciales insertados con éxito.');
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
        console.info(`INFO - Servidor corriendo en el puerto ${PORT}.`);
    });
}
