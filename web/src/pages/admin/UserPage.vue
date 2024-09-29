<template>
    <q-page class="q-px-lg q-py-xs">
        <!-- <TitlePages :title="$t('users.title') "
        :description="$t('users.description')" :icon="'group_add'"  /> -->
        <q-item class="q-mr-none" style="padding: 0px 0px;">
            <q-item-section class="q-pa-none">
                <q-item-label class="title-panel-users">{{ $t('users.title') }}</q-item-label>
                <q-item-label caption class="description-panel-users" no-caps>
                    {{ $t('users.description') }}
                </q-item-label>
            </q-item-section>
        </q-item>

        <div class="col-12 q-py-none">
            <div class="div-rounded-radius">
                <q-card flat>
                    <q-card-section class="q-px-none">
                        <q-table class="q-px-none full-width" flat :rows="users" :columns="columns" row-key="name"
                            hide-pagination>
                            <template v-slot:top>
                                <q-item class="q-px-none full-width">
                                    <q-item-section class="q-pa-none">
                                        <q-item-label class="title-table-users">Team members</q-item-label>
                                        <q-item-label>
                                            <q-chip outline color="primary" size="12px" icon="people_outline" class="chip-total-users">
                                                {{ totalUsers }} users
                                            </q-chip>
                                        </q-item-label>
                                    </q-item-section>

                                    <q-item-section class="q-pa-none" side>
                                        <q-input dense outlined v-model="search" input-class="text-right"
                                            class="q-ml-md btn-border-radius" @update:model-value="onSearchChange">
                                            <template v-slot:append>
                                                <q-icon v-if="search === ''" name="search" />
                                                <q-icon v-else name="clear" class="cursor-pointer"
                                                    @click="clearSearch" />
                                            </template>
                                        </q-input>
                                    </q-item-section>

                                    <q-item-section class="q-pa-none" side>
                                        <q-btn :label="$t('users.btn_create')" icon="group_add" color="primary"
                                            class="btn-border-radius" @click="showCreateUserModal" />
                                    </q-item-section>
                                </q-item>
                            </template>

                            <template v-slot:header="props">
                                <q-tr :props="props" class="div-rounded-radius">
                                    <q-th v-for="col in props.cols" :key="col.name" :props="props" class="bg-second"
                                        auto-width>
                                        {{ col.label }}
                                    </q-th>
                                </q-tr>
                            </template>

                            <template v-slot:body="props">
                                <q-tr :props="props" @click="showing = true">
                                    <q-td key="name" :props="props">
                                        <ItemUserTable :user="props.row" />
                                    </q-td>
                                    <q-td key="email" :props="props">{{ props.row.email }}</q-td>
                                    <q-td key="personal_phone" :props="props">{{ props.row.personal_phone || 'N/A'
                                        }}</q-td>
                                    <q-td key="role" :props="props">
                                        <ItemRoleTable :user="props.row" />
                                    </q-td>
                                    <q-td key="actions" :props="props">
                                        <q-btn round icon="edit" flat size="md" @click="editUser(props.row)" />
                                        <q-btn flat size="md" round icon="delete_outline"
                                            @click="deleteUser(props.row)" />
                                    </q-td>
                                </q-tr>
                            </template>
                        </q-table>
                    </q-card-section>

                    <q-card-section class="q-px-none">
                        <div class="row justify-center">
                            <q-pagination v-model="pagination.page" :max="pagesNumber"
                                @update:model-value="onPaginationChange" direction-links />
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>

        <UserFormModal v-if="showModal" :isOpen="showModal" :user="selectedUser" @close="closeModal"
            @save="fetchUsers" />
    </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from 'stores/user';
import UserFormModal from 'components/Users/UserFormModal.vue';
import ItemUserTable from 'components/Users/ItemUserTable.vue';
import ItemRoleTable from 'components/Users/ItemRoleTable.vue';
import TitlePages from 'components/General/TitlePages.vue';
const userStore = useUserStore();
const users = ref([]);
const totalUsers = ref(0);
const search = ref('');
const showModal = ref(false);
const selectedUser = ref(null);

const pagination = ref({
    page: 1,
    rowsPerPage: 10,
});

const columns = ref([
    { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
    { name: 'email', label: 'Correo', align: 'left', field: 'email' },
    { name: 'personal_phone', label: 'Phone', align: 'left', field: 'personal_phone' },
    { name: 'role', label: 'Role', align: 'left', field: 'role' },
    { name: 'actions', label: 'Acciones', align: 'center' },
]);

const pagesNumber = computed(() => Math.ceil(totalUsers.value / pagination.value.rowsPerPage));

// Función para buscar usuarios, incluyendo filtros y paginación
const fetchUsers = async () => {
    console.log("Fetching users...");
    const response = await userStore.getAllUsers(
        search.value,
        pagination.value.page,
        pagination.value.rowsPerPage
    );
    users.value = response.users;
    totalUsers.value = response.totalUsers;
};
const onSearchChange = () => {
    console.log("onSearchChange users...");
    if (search.value.length > 2) {
        fetchUsers();
    }else{
        if (search.value.length == 0) {
            fetchUsers();
        }
    }
};
// Cambiar la página de paginación y buscar de nuevo
const onPaginationChange = (newPage) => {
    pagination.value.page = newPage;
    fetchUsers();
};

// Llama a fetchUsers cuando cambien los valores de paginación o filtro
// watch([pagination, search], fetchUsers);
const clearSearch = () => {
    search.value = '';
    fetchUsers();
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

.title-panel-users {
    font-size: 24px !important;
    font-weight: bold;
    text-transform: none;
}

.title-table-users {
    font-size: 20px !important;
    font-weight: bold;
    text-transform: none;
}

.description-panel-users {
    font-size: 18px !important;
    text-transform: none;
}

</style>
