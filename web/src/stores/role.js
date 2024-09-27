import { defineStore } from "pinia";
import { apolloClient, gql } from "../plugins/apollo";

export const useRoleStore = defineStore("role", {
    state: () => ({
        roles: null,
        role: null,
        error: null,
        message: null,
        isRolesFetched: false,
    }),
    actions: {
        async getAllRoles() {
            const ROLES_QUERY = gql`
                query getRoles {
                    getRoles {
                        role_id
                        name
                        title
                        description
                    }
                }
            `;
            try {
                const response = await apolloClient.query({
                    query: ROLES_QUERY,
                    fetchPolicy: "network-only",
                });
                this.roles = response.data.getRoles;
                this.isRolesFetched = true; // Marca que los roles han sido fetchados
                return this.roles;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async fetchRoleById(roleId) {
            const ROLE_QUERY = gql`
                query getRoleById($roleId: String!) {
                    role(roleId: $roleId) {
                        role_id
                        name
                        title
                        description
                    }
                }
            `;
            try {
                const response = await apolloClient.query({
                    query: ROLE_QUERY,
                    variables: { roleId },
                    fetchPolicy: "network-only",
                });
                this.role = response.data.role;
                return this.role;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async createRole(newRole) {
            const CREATE_ROLE_MUTATION = gql`
                mutation CreateRole($input: RoleInput!) {
                    createRole(input: $input) {
                        role {
                            role_id
                            name
                            title
                            description
                        }
                        message
                    }
                }
            `;
            try {
                const response = await apolloClient.mutate({
                    mutation: CREATE_ROLE_MUTATION,
                    variables: {
                        input: {
                            name: newRole.name,
                            title: newRole.title,
                            description: newRole.description,
                        },
                    },
                });
                const { role, message } = response.data.createRole;
                this.roles.push(role); // Añade el nuevo rol al estado
                return message;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },
        async updateRole(updatedRole) {
            const UPDATE_ROLE_MUTATION = gql`
                mutation UpdateRole($roleId: String!, $input: RoleInput!) {
                    updateRole(roleId: $roleId, input: $input) {
                        role {
                            role_id
                            name
                            title
                            description
                        }
                        message
                    }
                }
            `;
            try {
                const response = await apolloClient.mutate({
                    mutation: UPDATE_ROLE_MUTATION,
                    variables: {
                        roleId: updatedRole.role_id,
                        input: {
                            name: updatedRole.name,
                            title: updatedRole.title,
                            description: updatedRole.description,
                        },
                    },
                });
                const { role, message } = response.data.updateRole;
                const index = this.roles.findIndex(r => r.role_id === role.role_id);
                if (index !== -1) {
                    this.roles[index] = role; // Actualiza el rol en el estado
                }
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
                const response = await apolloClient.mutate({
                    mutation: DELETE_ROLE_MUTATION,
                    variables: { roleId },
                });
                const { message } = response.data.deleteRole;
                // Opcional: eliminar el rol del estado después de eliminar
                this.roles = this.roles.filter(role => role.role_id !== roleId);
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
