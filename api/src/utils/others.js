// Ejemplo de función para otorgar permisos a un rol
const grantRoleAccess = async (roleId, resourceId, resourceType, actionId) => {
    await models.ResourceAccess.create({
        role_id: roleId,
        resource_id: resourceId,
        resource_type: resourceType,
        action_id: actionId,
        access_type: 'role_based'
    });
};
// Ejemplo de función para otorgar acceso a un usuario
const grantUserAccess = async (userId, resourceId, resourceType, actionId) => {
    await models.ResourceAccess.create({
        user_id: userId,
        resource_id: resourceId,
        resource_type: resourceType,
        action_id: actionId,
        access_type: 'custom'  // Puede ser 'custom', 'view', 'edit', etc.
    });
};
