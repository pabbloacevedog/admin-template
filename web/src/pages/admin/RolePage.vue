<template>
    <q-page class="role-page">
        <div class="row justify-between items-center q-mb-lg">
            <h1 class="text-h5">Gestión de Roles</h1>
            <q-btn @click="showCreateRoleModal" color="primary" label="Crear Rol" />
        </div>

        <q-table :rows="roles" :columns="columns" row-key="role_id" @request="fetchRoles"
            v-model:pagination="pagination">
            <template v-slot:top-right>
                <q-input v-model="search" debounce="300" placeholder="Buscar..." class="q-mb-md" />
            </template>
            <template v-slot:body-cell-actions="props">
                <q-btn @click="editRole(props.row)" icon="edit" color="secondary" flat />
                <q-btn @click="deleteRole(props.row.role_id)" icon="delete" color="negative" flat />
            </template>
        </q-table>

        <RoleFormModal v-if="showModal" :isOpen="showModal" :role="selectedRole" @close="closeModal" @save="fetchRoles" />
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoleStore } from 'stores/role';
import RoleFormModal from 'components/Roles/RoleFormModal.vue';

const roleStore = useRoleStore();
const roles = ref([]);
const columns = ref([
    { name: 'role_id', label: 'ID', align: 'left', field: 'role_id' },
    { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
    { name: 'title', label: 'Título', align: 'left', field: 'title' },
    { name: 'actions', label: 'Acciones', align: 'center' },
]);
const showModal = ref(false);
const selectedRole = ref(null);
const search = ref('');
const pagination = ref({ page: 1, rowsPerPage: 10 });

const fetchRoles = async () => {
    roles.value = await roleStore.getAllRoles();
};

const showCreateRoleModal = () => {
    selectedRole.value = null;
    showModal.value = true;
};

const editRole = (role) => {
    selectedRole.value = role;
    showModal.value = true;
};

const deleteRole = async (roleId) => {
    await roleStore.deleteRole(roleId);
    fetchRoles();
};

const closeModal = () => {
    showModal.value = false;
};

onMounted(fetchRoles);
</script>

<style scoped>
.role-page {
    padding: 20px;
}
</style>
