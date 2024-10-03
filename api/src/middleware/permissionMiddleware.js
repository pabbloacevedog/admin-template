import models from '../models/index.js';
import throwCustomError, { ErrorTypes } from '../helpers/error-handler.helper.js';
import validateConditions from '../utils/condition-validator.js';
// Función middleware para validar si el usuario tiene una acción específica
const validatePermission = async (userId, action, route) => {
    const user = await models.User.findByPk(userId, {
        include: [
            {
                model: models.Role,
                include: [
                    {
                        model: models.Permission,
                        where: {
                            action_id: action,
                            route_id: route,
                        },
                        include: [models.Condition], // Incluir las condiciones
                    },
                ],
            },
        ],
    });

    if (!user || !user.Role || !user.Role.Permissions.length) {
        throwCustomError(ErrorTypes.UNAUTHORIZED_ACTION);
    }

    // Validar condiciones del permiso
    const permission = user.Role.Permissions.find(p => p.action_id === action && p.route_id === route);

    if (permission) {
        const conditionsValid = await validateConditions(userId, permission.permission_id, route);
        if (!conditionsValid) {
            throwCustomError(ErrorTypes.UNAUTHORIZED_ACTION); // Condiciones no cumplidas
        }
    }
};

export default validatePermission;
