<template>
    <q-page class="q-py-xs">
        <TitlePages :title="$t('roles.title')" :description="$t('roles.description')"
            :icon="$t('roles.icon')" :btn_create="showModal" :label_btn="'Crear Usuario'" />
        <div class="col-12 q-pt-md" style="position: relative;">
            <div class="q-pa-md">
            <q-table grid flat bordered card-class="bg-primary text-white" title="Treats" :rows="roles"
                :columns="columns" row-key="name" :filter="filter" hide-header @request="fetchRoles">
                <template v-slot:top-right>
                    <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </template>
                <template v-slot:body-cell-actions="props">
                    <q-btn @click="editRole(props.row)" icon="edit" color="secondary" flat />
                    <q-btn @click="deleteRole(props.row.role_id)" icon="delete" color="negative" flat />
                </template>
            </q-table>
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
    </div>
        <RoleFormModal v-if="showModal" :isOpen="showModal" :role="selectedRole" @close="closeModal"
            @save="fetchRoles" />
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoleStore } from 'stores/role';
import RoleFormModal from 'components/Roles/RoleFormModal.vue';
import TitlePages from 'components/General/TitlePages.vue';
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
