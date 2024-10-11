import { defineStore } from "pinia";
import { computed } from 'vue';
import { useAuthStore } from 'stores/auth';
export const useGlobalStore = defineStore("global", {
    state: () => ({
        authStore : useAuthStore(),
        routes : [],
    }),
    actions: {
        async getAvailableActions(routeName) {
            try {
                this.routes = await this.authStore.userRoutes();
                return computed(() => {
                    const route = this.routes.find(route => route.name === routeName);
                    return route ? route.action : [];
                });
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async canCreate(routeName) {
            try {
                const availableActions = await this.getAvailableActions(routeName);
                const createPermission = availableActions.value.find(permission => permission.name === 'create');

                if (!createPermission) return false; // Si no tiene permiso de creación, no puede crear

                return true; // Por defecto, puede crear si tiene el permiso
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async canView(resource,routeName) {
            try {
                const availableActions = await this.getAvailableActions(routeName);
                const viewPermission = availableActions.value.find(permission => permission.name === 'view');

                if (!viewPermission) return false; // Si no tiene permiso de eliminación, no puede eliminar

                const condition = viewPermission.condition;
                if (condition.name === 'all') {
                    return true; // Puede eliminar cualquier recurso
                }

                if (condition.name === 'owner_only') {
                    return this.isOwner(resource); // Implementar esta función según la lógica de tu app
                }

                return false; // Por defecto, no puede eliminar
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async canDelete(resource, routeName) {
            try {
                if (resource.role_id === this.authStore.user.role?.role_id) return false;
                const availableActions = await this.getAvailableActions(routeName);
                const deletePermission = availableActions.value.find(permission => permission.name === 'delete');

                if (!deletePermission) return false; // Si no tiene permiso de creación, no puede crear

                const condition = deletePermission.condition;
                if (condition.name === 'all') {
                    return true; // Puede eliminar cualquier recurso
                }

                if (condition.name === 'owner_only') {
                    return this.isOwner(resource); // Implementar esta función según la lógica de tu app
                }

                return false; // Por defecto, no puede eliminar
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async canUpdate(resource, routeName) {
            try {
                const availableActions = await this.getAvailableActions(routeName);
                const editPermission = availableActions.value.find(permission => permission.name === 'update');

                if (!editPermission) return false; // Si no tiene permiso de creación, no puede crear

                const condition = editPermission.condition;
                if (condition.name === 'all') {
                    return true; // Puede eliminar cualquier recurso
                }

                if (condition.name === 'owner_only') {
                    return this.isOwner(resource); // Implementar esta función según la lógica de tu app
                }

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
    },
});
