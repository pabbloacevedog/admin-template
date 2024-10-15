import { defineStore } from "pinia";
import { apolloClient, gql } from "../plugins/apollo"; import { computed } from 'vue';
import { useAuthStore } from 'stores/auth';
export const useGlobalStore = defineStore("global", {
    state: () => ({
        authStore: useAuthStore(),
        routes: [],
        routesLoaded: false, // Variable para controlar si las rutas ya se han cargado
    }),
    actions: {
        // Cargar rutas solo si no han sido cargadas previamente
        async loadRoutes() {
            if (!this.routesLoaded) {
                this.routes = await this.authStore.userRoutes(); // Hacer una sola llamada a la API
                this.routesLoaded = true; // Marcar como cargadas
            }
        },
        // Obtener las acciones disponibles para una ruta
        async getAvailableActions(routeName) {
            try {
                await this.loadRoutes(); // Asegurar que las rutas estén cargadas
                const route = this.routes.find(route => route.name === routeName);
                return route ? route.action : []; // Devolver las acciones o un array vacío
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },

        // Obtener el recurso por routeName
        async getNameResource(routeName) {
            try {
                await this.loadRoutes(); // Asegurar que las rutas estén cargadas
                const route = this.routes.find(route => route.name === routeName);
                return route ? route.resource : ''; // Devolver el recurso o una cadena vacía
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async canCreate(routeName) {
            try {
                const availableActions = await this.getAvailableActions(routeName);
                const createPermission = availableActions.find(permission => permission.name === 'create');

                if (!createPermission) return false; // Si no tiene permiso de creación, no puede crear

                return true; // Por defecto, puede crear si tiene el permiso
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async canVerifyManually(routeName) {
            try {
                const availableActions = await this.getAvailableActions(routeName);
                const createPermission = availableActions.find(permission => permission.name === 'verify_manually');

                if (!createPermission) return false; // Si no tiene permiso de creación, no puede crear

                return true; // Por defecto, puede crear si tiene el permiso
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async canView(resource, routeName) {
            try {
                const availableActions = await this.getAvailableActions(routeName);
                const viewPermission = availableActions.find(permission => permission.name === 'view');

                if (!viewPermission) return false; // Si no tiene permiso de eliminación, no puede eliminar
                const condition = viewPermission.condition;
                if (condition.name === 'all') return true;
                if (condition.name === 'owner_only') return this.isOwner(resource);
                if (condition.name === 'others') return this.hasUserOrRoleAccess(resource, viewPermission);
                if (condition.name === 'resource') return this.hasResourceAccess(resource, viewPermission, routeName);

                return false; // Por defecto, no puede eliminar
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async canDelete(resource, routeName) {
            try {
                const availableActions = await this.getAvailableActions(routeName);
                const deletePermission = availableActions.find(permission => permission.name === 'delete');

                if (!deletePermission) return false; // Si no tiene permiso de creación, no puede crear
                // Datos del usuario autenticado
                const { user_id: authUserId, role: { role_id: authRoleId } } = this.authStore.user;
                // Validar si el usuario está intentando eliminarse a sí mismo
                if (routeName === 'users' && resource.user_id === authUserId) {
                    return false; // No puede eliminarse a sí mismo
                }

                // Validar si el usuario está intentando eliminar su propio rol
                if (routeName === 'roles' && resource.role_id === authRoleId) {
                    return false; // No puede eliminar su propio rol
                }
                const condition = deletePermission.condition;
                if (condition.name === 'all') return true;
                if (condition.name === 'owner_only') return this.isOwner(resource);
                if (condition.name === 'others') return this.hasUserOrRoleAccess(resource, deletePermission);
                if (condition.name === 'resource') return this.hasResourceAccess(resource, deletePermission, routeName);

                return false; // Por defecto, no puede eliminar
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async canUpdate(resource, routeName) {
            try {
                const availableActions = await this.getAvailableActions(routeName);
                const editPermission = availableActions.find(permission => permission.name === 'update');

                if (!editPermission) return false; // Si no tiene permiso de creación, no puede crear

                const condition = editPermission.condition;
                if (condition.name === 'all') return true;
                if (condition.name === 'owner_only') return this.isOwner(resource);
                if (condition.name === 'others') return this.hasUserOrRoleAccess(resource, editPermission);
                if (condition.name === 'resource') return this.hasResourceAccess(resource, editPermission, routeName);

                return false; // Por defecto, no puede eliminar
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async isOwner(resource) {
            try {
                return resource.user_id === this.authStore.user?.user_id || resource.owner_id === this.authStore.user?.user_id  // Ajusta esto según tu lógica
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        // Verifica acceso para el caso 'others'
        // Verifica acceso para el caso 'others'
        async hasUserOrRoleAccess(resource, permission, routeName) {
            try {
                const resourceAccessPermission = permission.condition.resourceAccess;

                // Obtener los role_ids y user_ids permitidos
                const roleIds = resourceAccessPermission.map(access => access.role_id);
                const userIds = resourceAccessPermission.map(access => access.user_id);

                if (resource.owner_id === '1') return false;
                // Consultar el role_id del owner del recurso
                const role_id = await this.getRoleByOwnerId(resource.owner_id);
                // Verificar si el role_id o el owner_id tienen permisos de acceso
                return roleIds.includes(role_id) || userIds.includes(resource.owner_id);
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        // Obtener el role_id basado en el owner_id del recurso
        async getRoleByOwnerId(ownerId) {
            const GET_ROLE_BY_OWNER_ID_QUERY = gql`
                query getRoleByOwnerId($ownerId: String!) {
                getRoleByOwnerId(ownerId: $ownerId) {
                        role_id
                    }
                }
                `;

            try {
                const response = await apolloClient.query({
                    query: GET_ROLE_BY_OWNER_ID_QUERY,
                    variables: { ownerId }, // Debe ser ownerId y no roleId
                    fetchPolicy: "network-only",
                });

                // Retornar el role_id del propietario
                const role_id = response.data.getRoleByOwnerId.role_id;
                return role_id;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },

        // Verifica acceso para el caso 'resource'
        async hasResourceAccess(resource, permission, routeName) {
            try {
                const nameResource = await this.getNameResource(routeName);
                const resourceAccessPermission = permission.condition.resourceAccess;
                const resourceIdKey = `${nameResource}_id`;
                const resourceId = resource[resourceIdKey];
                const resourceIds = resourceAccessPermission.map(access => access.resource_id);

                return resourceIds.includes(resourceId);
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        resetStore() {
            this.routes = [];
            this.routesLoaded = false; // Reiniciar la carga de rutas
        },
    },
});
