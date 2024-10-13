<template>
    <q-page class="page-padding">
        <TitlePages :title="$t('users.title')" :description="$t('users.description')" :icon="'group_add'" />
        <div class="col-12 q-py-none">
            <div class="div-rounded-radius">
                <q-card flat>
                    <q-card-section class="q-pa-none">
                        <q-table class="q-px-none full-width" flat :rows="users" :columns="columns" row-key="name"
                            :pagination="pagination" :rows-per-page-options="[5, 10, 15, 20]" hide-pagination>
                            <template v-slot:top>
                                <q-item class="q-px-none full-width">
                                    <q-item-section class="q-pa-none">
                                        <q-item-label class="title-table-users">Team members</q-item-label>
                                        <q-item-label>
                                            <q-chip outline color="primary" size="12px" icon="people_outline"
                                                class="chip-total-users">
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

                                    <q-item-section class="q-pa-none" side v-if="!$q.platform.is.mobile">
                                        <q-btn :label="$t('users.btn_create')" icon="group_add" color="primary"
                                            class="btn-border-radius" @click="showCreateUserModal" v-if="canCreateRef" />
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
                                <q-tr :props="props">
                                    <q-td key="name" :props="props" @click="showViewUserModal(props.row)"
                                        class="cursor-pointer">
                                        <ItemUserTable :user="props.row" />
                                    </q-td>
                                    <q-td key="verified" :props="props" class="cursor-pointer">
                                        <q-icon name="verified" v-if="props.row.verified"
                                            class="text-verified cursor-pointer" size="24px" />
                                        <q-icon name="verified" v-else color="second" size="24px" />
                                    </q-td>
                                    <q-td key="personal_phone" :props="props">{{ props.row.personal_phone || 'N/A'
                                        }}</q-td>
                                    <q-td key="role" :props="props">
                                        <ItemRoleTable :user="props.row" />
                                    </q-td>
                                    <q-td key="state" :props="props">
                                        <q-chip  text-color="negative"
                                            v-if="!props.row.state" label="Inactive" class="chip-user-inactive"
                                            />
                                        <q-chip text-color="positive" v-else
                                            label="Active" class="chip-user-active" />
                                    </q-td>
                                    <q-td key="actions" :props="props">
                                        <ItemActionsTable :resource="props.row" :edit="editUser"
                                            :showDeleteModal="showDeleteUserModal"
                                            :showViewModal="showViewUserModal"
                                            :permissions="availableActions" />
                                    </q-td>
                                </q-tr>
                            </template>
                        </q-table>
                    </q-card-section>

                    <q-card-section class="q-px-none" v-if="pagination.rowsNumber > 0">
                        <div class="row justify-center">
                            <q-pagination v-model="pagination.page" :max="pagesNumber"
                                @update:model-value="onPaginationChange" direction-links />
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>

        <UserFormModal v-if="userStore.show_modal_user" :user="selectedUser" @close="closeModal" />
        <UserDeleteModal v-if="userStore.show_modal_delete" :user="selectedUser" @close="closeModalDelete" />
        <UserViewModal v-if="userStore.show_modal_view" :user="selectedUser" @close="closeModalView" />
        <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="$q.platform.is.mobile">
            <q-btn fab icon="group_add" color="primary" @click="showCreateUserModal" class="shadow-9" />
        </q-page-sticky>
    </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useUserStore } from 'stores/user';
import { debounce } from 'lodash';
import UserFormModal from 'components/Users/UserFormModal.vue';
import UserDeleteModal from 'components/Users/UserDeleteModal.vue';
import UserViewModal from 'components/Users/UserViewModal.vue';
import ItemUserTable from 'components/Users/ItemUserTable.vue';
import ItemRoleTable from 'components/Users/ItemRoleTable.vue';
import ItemActionsTable from 'components/General/ItemActionsTable.vue';
import TitlePages from 'components/General/TitlePages.vue';
import { useAuthStore } from 'stores/auth';
import { useGlobalStore } from 'stores/global';
const globalStore = useGlobalStore();
const authStore = useAuthStore();
const userStore = useUserStore();

const users = ref([]);
const totalUsers = ref(0);
const search = ref('');

const selectedUser = ref(null);

const pagination = ref({
    page: 1,
    rowsPerPage: 10,
});
// Extraer acciones para la ruta actual
const routeName = 'users'; // Cambia esto según el nombre de la ruta actual
const actions = ref([]);
const routes = ref([]);
const canCreateRef = ref(false);
const canViewRef = ref(false);
const columns = ref([
    { name: 'name', label: 'User Name', align: 'left', field: 'name', sortable: true },
    { name: 'verified', label: 'Verified', align: 'left', field: 'verified', sortable: true },
    { name: 'personal_phone', label: 'Phone', align: 'left', field: 'personal_phone' },
    {
        name: 'role', label: 'Role', align: 'left', field: 'role', sortable: true, sort: (a, b) => {
            const roleA = a.role_id ? parseInt(a.role_id, 10) : 0; // Cambia a.role_id según tu estructura de datos
            const roleB = b.role_id ? parseInt(b.role_id, 10) : 0; // Cambia b.role_id según tu estructura de datos
            return roleA - roleB;
        }
    },
    { name: 'state', label: 'State', align: 'left', field: 'state' },
    { name: 'actions', label: 'Acciones', align: 'center' },
]);

const pagesNumber = computed(() => Math.ceil(totalUsers.value / pagination.value.rowsPerPage));
// Computed para obtener las acciones de la ruta
const availableActions = computed(() => {
    const route = routes.value.find(route => route.name === routeName);
    return route ? route.action : [];
});
// Función para buscar usuarios, incluyendo filtros y paginación
const fetchUsers = async () => {
    // console.log("Fetching users...");

    // Llama a la función para encontrar la acción de 'view'
    // const viewAction = findViewAction();
    const viewAction = availableActions.value.find(permission => permission.name === 'view');
    // console.log(viewAction, 'viewAction')
    // Almacena la respuesta de los usuarios
    let response;

    // Verifica la condición del permiso
    if (viewAction && viewAction.condition.name === 'all') {
        // Si la condición es 'all', traer todos los usuarios
        response = await userStore.getAllUsers(
            search.value,
            pagination.value.page,
            pagination.value.rowsPerPage
        );
    } else if (viewAction && viewAction.condition.name === 'owner_only') {
        // Si la condición es 'owner_only', traer solo los usuarios que ha creado el usuario actual
        response = await userStore.getUsersByOwner(
            search.value,
            pagination.value.page,
            pagination.value.rowsPerPage
        );
    } else {
        console.log("No tiene permisos para ver usuarios.");
        return; // Salir si no hay permisos
    }

    // Almacena los usuarios y el total de usuarios en el estado
    users.value = response.users;
    totalUsers.value = response.totalUsers;

    // Debugging logs
    // console.log('totalUsers: ' + totalUsers.value);
    // console.log('users: ', users.value);
    // console.log('pagination: ', pagination.value);
};
const fetchPermissions = async () => {
    try {
        console.log('fetchPermissions')
        canCreateRef.value = await globalStore.canCreate(routeName);
    } catch (error) {
        console.error('Error fetching permissions:', error);
    }
};
const canView = async (resource) => {
    try {
        return canViewRef.value = await globalStore.canView(resource, routeName);
    } catch (error) {
        console.error('Error fetching permissions:', error);
    }
};
const onSearchChange = debounce(() => {
    if (search.value.length > 2 || search.value.length === 0) {
        fetchUsers();
    }
}, 300); // 300ms debounce
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
    if (canView()) {
        userStore.show_modal_user = true;
    }
};
const showDeleteUserModal = (user) => {
    selectedUser.value = user;
    userStore.show_modal_delete = true;
};
const showViewUserModal = (user) => {
    selectedUser.value = user;
    if (canView(user)) {
        userStore.show_modal_view = true;
    }
};
const editUser = (user) => {
    selectedUser.value = user;
    userStore.show_modal_user = true;
};

const deleteUser = async (userId) => {
    await userStore.deleteUser(userId);
    fetchUsers();
};

const closeModal = () => {
    userStore.show_modal_user = false;
    fetchUsers();
};
const closeModalDelete = () => {
    userStore.show_modal_delete = false;
    fetchUsers();
};
const closeModalView = () => {
    userStore.show_modal_view = false;
    fetchUsers();
};

onMounted(async () => {
    try {

        routes.value = await authStore.userRoutes();
        actions.value = availableActions.value;
        fetchUsers()
        fetchPermissions()
        console.log('Available Actions:', actions.value);
    } catch (error) {
        console.error('Error fetching user:', error);
    }
});
watch(
    () => userStore.show_modal_user,
    (newValue) => {
        if (newValue === false) {
            fetchUsers();
            fetchPermissions()
        }
    }
);
</script>
<script>
export default {
    name: 'UserPage',
}
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

@media (max-width: 768px) {
	.title-table-users {
		font-size: 16px !important;
		font-weight: bold;
		text-transform: none;
	}
}

@media (min-width: 768px) {
	.title-table-users {
		font-size: 20px !important;
		font-weight: bold;
		text-transform: none;
	}
}
.description-panel-users {
    font-size: 18px !important;
    text-transform: none;
}

</style>
