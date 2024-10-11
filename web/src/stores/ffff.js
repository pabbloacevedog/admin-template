import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useAuthStore } from './auth'; // Si tienes un auth store para manejar el usuario actual

export const useGlobalStore = defineStore('global', () => {
    const authStore = useAuthStore();

    // Computed para obtener las acciones de la ruta actual
    function getAvailableActions(routes, routeName) {
        return computed(() => {
            const route = routes.find(route => route.name === routeName);
            return route ? route.action : [];
        });
    }

    // Función para verificar si el usuario puede ver un recurso
    function canView(routeName, routes, role) {
        const availableActions = getAvailableActions(routes, routeName);
        const viewPermission = availableActions.value.find(permission => permission.name === 'view');

        if (!viewPermission) return false; // Si no tiene permiso de visualización, no puede ver

        const condition = viewPermission.condition;
        if (condition.name === 'all') {
            return true; // Puede ver cualquier recurso
        }

        if (condition.name === 'owner_only') {
            return roleIsOwner(role); // Aquí debes implementar `roleIsOwner` en el store o pasar una referencia
        }

        return false; // Por defecto, no puede ver
    }

    // Función para verificar si el usuario puede crear un recurso
    function canCreate(routeName, routes) {
        const availableActions = getAvailableActions(routes, routeName);
        const createPermission = availableActions.value.find(permission => permission.name === 'create');

        if (!createPermission) return false; // Si no tiene permiso de creación, no puede crear

        return true; // Por defecto, puede crear si tiene el permiso
    }

    // Computed para verificar si el usuario puede eliminar un recurso
    function canDelete(resource, routeName, routes) {
        // El usuario no puede eliminar su propio role
        if (resource.role_id === authStore.user.role?.role_id) return false;

        const availableActions = getAvailableActions(routes, routeName);
        const deletePermission = availableActions.value.find(permission => permission.name === 'delete');

        if (!deletePermission) return false; // Si no tiene permiso de eliminación, no puede eliminar

        const condition = deletePermission.condition;
        if (condition.name === 'all') {
            return true; // Puede eliminar cualquier recurso
        }

        if (condition.name === 'owner_only') {
            return isOwner(resource); // Implementar la función `isOwner` para verificar propiedad del recurso
        }

        return false; // Por defecto, no puede eliminar
    }

    // Función para verificar si el usuario es el propietario
    function roleIsOwner(role) {
        return authStore.user.role?.role_id === role.role_id;
    }

    // Función para verificar si el recurso pertenece al usuario
    function isOwner(resource) {
        return authStore.user.id === resource.owner_id; // Asume que tienes un campo owner_id en el recurso
    }

    return {
        canView,
        canCreate,
        canDelete,
        isOwner,
        roleIsOwner,
        getAvailableActions
    };
});
