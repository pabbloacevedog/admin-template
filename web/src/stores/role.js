import { defineStore } from "pinia";
import { apolloClient, gql } from "../plugins/apollo";

export const useRoleStore = defineStore("role", {
    state: () => ({
        roles: [],
        role: null,
        totalRoles: 0,
        error: null,
        message: null,
        isRoleFetched: false,
        pagination: {
            page: 1,
            rowsPerPage: 10,
        },
        show_modal_role: false,
        show_modal_delete: false,
        show_modal_view: false,
    }),
    actions: {
        async createRole(details) {
            const CREATE_ROLE_MUTATION = gql`
                mutation createRole(
                    $input: RoleInput!
                ) {
                    createRole(
                        input: $input
                    ) {
                        role_id
                        message
                    }
                }
            `;
            try {
                this.clearError(); // Limpiar error antes de la mutación
                const response = await apolloClient.mutate({
                    mutation: CREATE_ROLE_MUTATION,
                    variables: {
                        input: details,
                    },
                    fetchPolicy: "network-only",
                });
                const { role_id, message } = response.data.createRole;
                return { role_id, message };
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async getAllRoles(search, page, rowsPerPage) {
            const ALL_ROLES_QUERY = gql`
                query getAllRoles($filter: FilterInput, $pagination: PaginationInput!) {
                    getAllRoles(pagination: $pagination, filter: $filter) {
                        roles {
                            role_id
                            name
                            title
                            description
                            color
                            owner_id
                            totalUsers
                            avatars
                        }
                        totalRoles
                    }
                }
            `;
            const variables = {
                pagination: {
                    page,
                    rowsPerPage,
                },
                filter: {
                    search,
                },
            };
            try {
                this.clearError(); // Limpiar error antes de la consulta
                const response = await apolloClient.query({
                    query: ALL_ROLES_QUERY,
                    variables,
                    fetchPolicy: 'network-only',
                });
                const { roles, totalRoles } = response.data.getAllRoles;
                this.roles = roles;
                this.totalRoles = totalRoles;
                return { roles: this.roles, totalRoles: this.totalRoles };
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async getRoleConfigData() {
            const ROLE_CONFIG_QUERY = gql`
                query getRoleConfiguration {
                    getRoleConfiguration {
                        routes {
                            route_id
                            name
                            title
                            description
                            path
                            icon
                            module_id
                            resource
                        }
                        actions {
                            action_id
                            name
                            title
                            description
                            icon
                        }
                        conditions {
                            condition_id
                            name
                            title
                            description
                        }
                    }
                }
            `;
            try {
                this.clearError(); // Limpiar error antes de la consulta
                const response = await apolloClient.query({
                    query: ROLE_CONFIG_QUERY,
                    fetchPolicy: 'network-only',
                });
                console.log('response', response);
                const resp = response.data.getRoleConfiguration;
                return resp;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async getRoles() {
            const ROLES_QUERY = gql`
                query getRoles {
                    getRoles {
                        role_id
                        name
                        title
                        description
                        color
                        owner_id
                    }
                }
            `;
            try {
                this.clearError(); // Limpiar error antes de la consulta
                const response = await apolloClient.query({
                    query: ROLES_QUERY,
                    fetchPolicy: "network-only",
                });
                this.roles = response.data.getRoles;
                this.isRoleFetched = true; // Marca que los roles han sido fetchados
                return this.roles;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async getRoleById(roleId) {
            const GET_ROLE_BY_ID_QUERY = gql`
                query getRoleById($roleId: String!) {
                    getRoleById(roleId: $roleId) {
                        role_id
                        name
                        title
                        description
                        color
                        permission {
                            permission_id
                            route {
                                route_id
                                name
                                title
                                description
                                path
                                icon
                                module_id
                                action {
                                    action_id
                                    name
                                    title
                                    description
                                    icon
                                    condition {
                                        condition_id
                                        name
                                        title
                                        description
                                        resourceAccess{
                                            resource_id
                                            resource_type
                                            user_id
                                            role_id
                                            action_id
                                            condition_id
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            try {
                this.clearError(); // Limpiar error antes de la consulta
                const response = await apolloClient.query({
                    query: GET_ROLE_BY_ID_QUERY,
                    variables: { roleId },
                    fetchPolicy: "network-only",
                });

                // Guardar el resultado en tu estado de roles (o según sea necesario)
                this.role = response.data.getRoleById;
                return this.role;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async getRolesByOwner(search, page, rowsPerPage) {
            const ALL_ROLES_QUERY = gql`
                query getRolesByOwner($filter: FilterInput, $pagination: PaginationInput!) {
                    getRolesByOwner(pagination: $pagination, filter: $filter) {
                        roles {
                            role_id
                            name
                            title
                            description
                            color
                        }
                        totalRoles
                    }
                }
            `;
            const variables = {
                pagination: {
                    page,
                    rowsPerPage,
                },
                filter: {
                    search,
                },
            };
            try {
                this.clearError(); // Limpiar error antes de la consulta
                const response = await apolloClient.query({
                    query: ALL_ROLES_QUERY,
                    variables,
                    fetchPolicy: 'network-only',
                });
                const { roles, totalRoles } = response.data.getRolesByOwner;
                this.roles = roles;
                this.totalRoles = totalRoles;
                return { roles: this.roles, totalRoles: this.totalRoles };
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async updateRole(updatedRole) {
            const UPDATE_ROLE_MUTATION = gql`
                mutation UpdateRole($roleId: String!, $input: RoleUpdateInput!) {
                    updateRole(roleId: $roleId, input: $input) {
                        role {
                            role_id
                            name
                            title
                            description
                            color
                        }
                        message
                    }
                }
            `;
            try {
                this.clearError(); // Limpiar error antes de la mutación
                const response = await apolloClient.mutate({
                    mutation: UPDATE_ROLE_MUTATION,
                    variables: {
                        roleId: updatedRole.role_id,
                        input: updatedRole,
                    },
                });
                const { role, message } = response.data.updateRole;
                this.role = role; // Actualiza el estado con la respuesta
                return message;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async deleteRole(roleId) {
            const DELETE_ROLE_MUTATION = gql`
                mutation DeleteRole($roleId: String!) {
                    deleteRole(roleId: $roleId) {
                        message
                    }
                }
            `;
            try {
                this.clearError(); // Limpiar error antes de la mutación
                const response = await apolloClient.mutate({
                    mutation: DELETE_ROLE_MUTATION,
                    variables: { roleId },
                });
                const { message } = response.data.deleteRole;
                this.role = null; // Limpia el estado del rol después de eliminar
                return message;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        clearError() {
            this.error = null;
        },
    },
});
