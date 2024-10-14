import models from '../models/index.js';
import throwCustomError, { ErrorTypes } from '../helpers/error-handler.helper.js';
import validateConditions from './conditionValidator.js';

// Función middleware para validar si el usuario tiene una acción específica
const validatePermission = async (userIdEditor, actionName, routeName, resourceId) => {
    // Primero obtenemos los IDs de action y route por sus nombres
    const action = await models.Action.findOne({
        where: { name: actionName }
    });
    const route = await models.Route.findOne({
        where: { name: routeName }
    });
    // Si no encontramos los action o route, no podemos continuar
    if (!action || !route) {
        throwCustomError(ErrorTypes.UNAUTHORIZED_ACTION);
    }
    console.log('tiene acciones y rutas')
    // Ahora con los IDs, hacemos la consulta principal
    const user = await models.User.findByPk(userIdEditor, {
        include: [
            {
                model: models.Role,
                include: [
                    {
                        model: models.Permission,
                        where: {
                            action_id: action.action_id,  // Usamos el ID de la acción
                            route_id: route.route_id,    // Usamos el ID de la ruta
                        },
                        include: [models.Condition], // Incluir las condiciones
                    },
                ],
            },
        ],
    });

    // Verificamos si se encontró el usuario y si tiene permisos
    if (!user) {
        throwCustomError(ErrorTypes.UNAUTHORIZED_ACTION);
    }
    console.log('El usuario: ' +userIdEditor+ ' tiene la accion ' + actionName + ' para la ruta ' + routeName)
    // solo se valida si la accion es distinta de 'create'
    if (action.name === 'create') {
        return;
    }
    // Validar condiciones del permiso
    const permission = user.Role.Permissions.find(p => p.action_id === action.action_id && p.route_id === route.route_id);
    console.log('permission: ', permission)
    if (permission) {
        const conditionsValid = await validateConditions(userIdEditor, permission, route.resource, resourceId);
        if (!conditionsValid) {
            throwCustomError(ErrorTypes.UNAUTHORIZED_ACTION); // Condiciones no cumplidas
        }
    } else {
        throwCustomError(ErrorTypes.UNAUTHORIZED_ACTION); // Permiso no encontrado
    }
};

export default validatePermission;
