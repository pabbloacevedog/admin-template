// scripts/initialize.js
const { sequelize, Module, Action, Role, Route } = require('./models'); // Ajusta según tu estructura de archivos

async function initialize() {
    await sequelize.sync({ force: true }); // Esto elimina las tablas existentes y crea nuevas

    // Insertar módulos
    // await Module.bulkCreate([
    //     { name: 'Auth' },
    //     { name: 'Admin' },
    //     // Agrega otros módulos aquí
    // ]);

    // Insertar acciones
    const actions = await models.Action.bulkCreate([
        { name: 'Create' },
        { name: 'Read' },
        { name: 'Update' },
        { name: 'Delete' },
    ]);

    // Insertar roles
    const roles = await models.Role.bulkCreate([
        { name: 'Admin' },
        { name: 'User' },
    ]);

    // Insertar rutas
    await models.Route.bulkCreate([
        { name: 'Settings', path: '/settings', icon: 'fa-solid fa-sliders' },
        { name: 'Dashboard', path: '/dashboard', icon: 'fa-solid fa-gauge'},
    ]);


    // Obtener los IDs de los roles y las acciones
    const adminRole = roles.find(role => role.name === 'Admin');
    const userRole = roles.find(role => role.name === 'User');

    const createAction = actions.find(action => action.name === 'Create');
    const readAction = actions.find(action => action.name === 'Read');
    const updateAction = actions.find(action => action.name === 'Update');
    const deleteAction = actions.find(action => action.name === 'Delete');

    // Insertar relaciones en RoleAction
    await models.RoleAction.bulkCreate([
        { role_id: adminRole.id, action_id: createAction.id },
        { role_id: adminRole.id, action_id: readAction.id },
        { role_id: adminRole.id, action_id: updateAction.id },
        { role_id: adminRole.id, action_id: deleteAction.id },
        { role_id: userRole.id, action_id: readAction.id }, // Por ejemplo, los usuarios solo pueden leer
    ]);

    console.log('Datos iniciales insertados con éxito.');
}

initialize().catch(error => {
    console.error('Error al insertar datos iniciales:', error);
});
