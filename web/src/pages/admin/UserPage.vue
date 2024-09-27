<template>
    <q-page class="user-page">
        <div class="row justify-between items-center q-mb-lg">
            <h1 class="text-h5">Gestión de Usuarios</h1>
            <q-btn @click="showCreateUserModal" color="primary" label="Crear Usuario" />
        </div>

        <q-table :rows="users" :columns="columns" row-key="user_id" @request="fetchUsers"
            v-model:pagination="pagination">
            <template v-slot:top-right>
                <q-input v-model="search" debounce="300" placeholder="Buscar..." class="q-mb-md" />
            </template>
            <template v-slot:body-cell-actions="props">
                <q-btn @click="editUser(props.row)" icon="edit" color="secondary" flat />
                <q-btn @click="deleteUser(props.row.user_id)" icon="delete" color="negative" flat />
            </template>
        </q-table>

        <UserFormModal v-if="showModal" :isOpen="showModal" :user="selectedUser" @close="closeModal" @save="fetchUsers" />
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from 'stores/user';
import UserFormModal from 'components/Users/UserFormModal.vue';

const userStore = useUserStore();
const users = ref([]);
const columns = ref([
    { name: 'user_id', label: 'ID', align: 'left', field: 'user_id' },
    { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
    { name: 'email', label: 'Correo', align: 'left', field: 'email' },
    { name: 'actions', label: 'Acciones', align: 'center' },
]);
const showModal = ref(false);
const selectedUser = ref(null);
const search = ref('');
const pagination = ref({ page: 1, rowsPerPage: 10 });

const fetchUsers = async () => {
    users.value = await userStore.getAllUsers();
};

const showCreateUserModal = () => {
    selectedUser.value = null;
    showModal.value = true;
};

const editUser = (user) => {
    selectedUser.value = user;
    showModal.value = true;
};

const deleteUser = async (userId) => {
    await userStore.deleteUser(userId);
    fetchUsers();
};

const closeModal = () => {
    showModal.value = false;
};

onMounted(fetchUsers);
</script>

<style scoped>
.user-page {
    padding: 20px;
}
</style>
