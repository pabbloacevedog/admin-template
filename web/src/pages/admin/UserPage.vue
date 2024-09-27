<template>
    <q-page class="q-px-xl q-py-xs">
        <TitlePages :title="$t('users.title')" :description="$t('users.description')" :icon="$t('users.icon')"
            :btn_create="showCreateUserModal" :label_btn="'Crear Usuario'" />
        <div class="col-12 q-py-md" style="position: relative;">
            <div class="q-py-lg  div-rounded-radius">
                <q-card class="" flat>
                    <q-card-section>
                        <q-table flat :rows="users" :columns="columns" row-key="name">
                            <template v-slot:header="props">
                                <q-tr :props="props" class="div-rounded-radius">
                                    <q-th auto-width />
                                    <q-th v-for="(col, index ) in props.cols" :key="col.name" :props="props" class="div-rounded-radius bg-second ">
                                        <div class="div-rounded-radius bg-second " v-if="index===0">
                                            {{ col.label }}
                                        </div>
                                        <div v-else>
                                            {{ col.label }}
                                        </div>
                                    </q-th>
                                </q-tr>
                            </template>
                            <template v-slot:body="props">
                                <q-tr :props="props" @click="onRowClick(props.row)">
                                    <!-- Avatar column -->
                                    <q-td key="avatar" :props="props">
                                        <q-avatar size="50px">
                                            <img :src="props.row.avatar">
                                        </q-avatar>
                                    </q-td>

                                    <!-- Name column -->
                                    <q-td key="name" :props="props">
                                        {{ props.row.name }}
                                    </q-td>

                                    <!-- Email column -->
                                    <q-td key="email" :props="props">
                                        {{ props.row.email }}
                                    </q-td>

                                    <!-- Username column -->
                                    <q-td key="username" :props="props">
                                        {{ props.row.username ? props.row.username : 'N/A' }}
                                    </q-td>

                                    <!-- Personal Phone column -->
                                    <q-td key="personal_phone" :props="props">
                                        {{ props.row.personal_phone ? props.row.personal_phone : 'N/A' }}
                                    </q-td>

                                    <!-- RUT User column -->
                                    <q-td key="rut_user" :props="props">
                                        {{ props.row.rut_user ? props.row.rut_user : 'N/A' }}
                                    </q-td>
                                    <q-td key="role" :props="props">
                                        {{ props.row.role ? props.row.role : 'N/A' }}
                                    </q-td>
                                    <!-- Role ID column -->
                                    <q-td key="actions" :props="props">
                                        <q-btn @click="editUser(props.row)" icon="edit" color="secondary" flat />
                                        <q-btn @click="deleteUser(props.row.user_id)" icon="delete" color="negative"
                                            flat />
                                    </q-td>
                                </q-tr>
                            </template>
                        </q-table>
                    </q-card-section>
                </q-card>

            </div>
        </div>
        <UserFormModal v-if="showModal" :isOpen="showModal" :user="selectedUser" @close="closeModal"
            @save="fetchUsers" />
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from 'stores/user';
import UserFormModal from 'components/Users/UserFormModal.vue';
import TitlePages from 'components/General/TitlePages.vue';
import SubTitleSettingsPanel from 'components/SettingsUser/SubTitleSettingsPanel.vue';
const userStore = useUserStore();
const users = ref([]);

const showModal = ref(false);
const selectedUser = ref(null);
const search = ref('');
const pagination = ref({ page: 1, rowsPerPage: 10 });
const onRowClick = (row) => alert(`${row.name} clicked`)

const columns = ref([
    { name: 'avatar', label: 'avatar', align: 'left', field: 'avatar' },
    { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
    { name: 'email', label: 'Correo', align: 'left', field: 'email' },
    { name: 'username', label: 'Username', align: 'left', field: 'username' },
    { name: 'personal_phone', label: 'Phone', align: 'left', field: 'personal_phone' },
    { name: 'role', label: 'Role', align: 'left', field: 'role' },
    { name: 'actions', label: 'Acciones', align: 'center' },
]);

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
