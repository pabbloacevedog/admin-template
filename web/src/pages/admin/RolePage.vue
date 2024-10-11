<template>
    <q-page class="page-padding">
        <TitlePages :title="$t('roles.title')" :description="$t('roles.description')" :icon="'group_add'" />
        <div class="col-12 q-py-none">
            <div class="div-rounded-radius">
                <q-card flat>
                    <q-card-section class="q-pa-none">
                        <q-table hide-pagination :rows="roles" :columns="columns" row-key="role_id" :filter="filter"
                            grid hide-header>
                            <!-- Input de búsqueda en la parte superior derecha -->
                            <template v-slot:top>
                                <q-item class="q-px-none full-width">
                                    <q-item-section class="q-pa-none">
                                        <q-item-label class="title-table-roles">Roles</q-item-label>
                                        <q-item-label>
                                            <q-chip outline color="primary" size="12px" icon="people_outline"
                                                class="chip-total-roles">
                                                {{ totalRoles }} roles
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
                                        <q-btn :label="$t('roles.btn_create')" icon="attribution" color="primary"
                                            class="btn-border-radius" @click="showCreateRoleModal" v-if="canCreateRef" />
                                    </q-item-section>
                                </q-item>
                            </template>

                            <!-- Slot para personalizar la visualización de cada ítem -->
                            <template v-slot:item="props">
                                <div class="q-pa-sm col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition q-m-lg"
                                    :style="props.selected ? 'transform: scale(0.95);' : ''">
                                    <q-card class="bg-card bg-second text-white" flat style="padding: 3% 8% !important;"
                                        :class="getCardClass(props.row)">
                                        <q-card-section class="q-pa-none">
                                            <q-item clickable v-ripple style="padding: 2px 2px;">
                                                <q-item-section class="text-h5">{{ props.row.title }}</q-item-section>
                                                <q-item-section avatar class="text-h7">
                                                    <q-avatar  text-color="white" style="border: 1px solid #fff !important;font-size: 32px;">{{ props.row.role_id }}</q-avatar>
                                                </q-item-section>
                                            </q-item>
                                        </q-card-section>
                                        <q-list dense>
                                            <q-item class="q-my-none q-mx-none"
                                                style="padding: 2px 2px; min-height: 6vh;">
                                                <q-item-section>
                                                    <q-item-label style="font-size: 15px; color: #d7d7d7 !important;" >
                                                        {{props.row.description }}
                                                    </q-item-label>
                                                </q-item-section>
                                            </q-item>
                                            <!-- Aquí agregamos los avatares de los usuarios -->
                                            <q-item class="q-my-sm"
                                                style="padding: 2px 2px;">
                                                <q-item-section>
                                                    <q-item-label class="text-h7">
                                                        <div class="flex justify-start" v-if="props.row.totalUsers">
                                                            <div  v-if="props.row.totalUsers > 1" class="text-h7">
                                                                +{{props.row.totalUsers}} role users
                                                            </div>
                                                            <div  v-else  class="text-h7">
                                                                +{{props.row.totalUsers}} role user
                                                            </div>
                                                        </div>
                                                        <div class="flex justify-start text-h7" v-else>
                                                            No users
                                                        </div>
                                                    </q-item-label>

                                                </q-item-section>
                                                <div class="flex justify-end">
                                                    <q-avatar v-for="(rs, n) in props.row.avatars" :key="n" size="30px"
                                                        class="overlapping" @click="selectRememberedUsers()"
                                                        :style="`right: ${n * 15}px`">
                                                        <img :src="rs">
                                                    </q-avatar>
                                                </div>
                                            </q-item>
                                            <q-separator></q-separator>
                                            <q-item class="flex justify-center q-mt-sm q-mx-none">
                                                <RoleActionsTable :resource="props.row" :edit="editRole"
                                                    :showDeleteModal="showDeleteRoleModal"
                                                    :showViewModal="showViewRoleModal"
                                                    :color="getColorClass(props.row)"
                                                    />
                                            </q-item>
                                        </q-list>
                                    </q-card>
                                </div>
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

        <RoleFormModal v-if="roleStore.show_modal_role" :role="selectedRole" @close="closeModal" />
        <RoleDeleteModal v-if="roleStore.show_modal_delete" :role="selectedRole" @close="closeModalDelete" />
        <RoleViewModal v-if="roleStore.show_modal_view" :role="selectedRole" @close="closeModalView" />
        <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="$q.platform.is.mobile">
            <q-btn fab icon="group_add" color="primary" @click="showCreateRoleModal" class="shadow-9" />
        </q-page-sticky>
    </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { debounce } from 'lodash';
import { useRoute } from 'vue-router';
import RoleFormModal from 'components/Roles/RoleFormModal.vue';
import RoleDeleteModal from 'components/Roles/RoleDeleteModal.vue';
import RoleViewModal from 'components/Roles/RoleViewModal.vue';
import RoleActionsTable from 'components/Roles/RoleActionsTable.vue';
import TitlePages from 'components/General/TitlePages.vue';
import { useAuthStore } from 'stores/auth';
import { useRoleStore } from 'stores/role';
import { useGlobalStore } from 'stores/global';
const globalStore = useGlobalStore();
const authStore = useAuthStore();
const roleStore = useRoleStore();
const roles = ref([]);
const totalRoles = ref(0);
const search = ref('');
const route = useRoute();
const selectedRole = ref(null);

const pagination = ref({
    page: 1,
    rowsPerPage: 10,
});
// Extraer acciones para la ruta actual
const routeName = route.name; // Capturar el nombre de la ruta
const actions = ref([]);
const routes = ref([]);
const canCreateRef = ref(false);
const columns = ref([
    { name: 'role_id', label: 'ID', align: 'left', field: 'role_id' },
    { name: 'name', label: 'Nombre', align: 'left', field: 'name' },
    { name: 'title', label: 'Título', align: 'left', field: 'title' },
    { name: 'description', label: 'Description', align: 'left', field: 'description' },
    { name: 'color', label: 'Color', align: 'left', field: 'color' },
    { name: 'actions', label: 'Acciones', align: 'center' },
]);
const getCardClass = (row) => {
    // console.log('row', row)
    // Asegúrate de que el color en la fila es válido y retorna la clase adecuada
    return row.color ? `bg-${row.color}` : 'bg-primary'; // Si no hay color, usa 'bg-primary' como clase por defecto
};
const getColorClass = (row) => {
    // console.log('row', row)
    // Asegúrate de que el color en la fila es válido y retorna la clase adecuada
    return row.color ? `text-${row.color}` : 'bg-primary'; // Si no hay color, usa 'bg-primary' como clase por defecto
};
const pagesNumber = computed(() => Math.ceil(totalRoles.value / pagination.value.rowsPerPage));
// Computed para obtener las acciones de la ruta
const availableActions = computed(() => {
    const route = routes.value.find(route => route.name === routeName);
    return route ? route.action : [];
});
// Función para buscar usuarios, incluyendo filtros y paginación
const fetchRoles = async () => {

    const viewAction = availableActions.value.find(permission => permission.name === 'view');
    // console.log(viewAction, 'viewAction')
    // Almacena la respuesta de los usuarios
    let response;

    // Verifica la condición del permiso
    if (viewAction && viewAction.condition.name === 'all') {
        // Si la condición es 'all', traer todos los usuarios
        response = await roleStore.getAllRoles(
            search.value,
            pagination.value.page,
            pagination.value.rowsPerPage
        );
    } else if (viewAction && viewAction.condition.name === 'owner_only') {
        // Si la condición es 'owner_only', traer solo los usuarios que ha creado el usuario actual
        response = await roleStore.getRolesByOwner(
            search.value,
            pagination.value.page,
            pagination.value.rowsPerPage
        );
    } else {
        console.log("No tiene permisos para ver usuarios.");
        return; // Salir si no hay permisos
    }

    // Almacena los usuarios y el total de usuarios en el estado
    roles.value = response.roles;
    totalRoles.value = response.totalRoles;
};

const onSearchChange = debounce(() => {
    if (search.value.length > 2 || search.value.length === 0) {
        fetchRoles();
    }
}, 300); // 300ms debounce
// Cambiar la página de paginación y buscar de nuevo
const onPaginationChange = (newPage) => {
    pagination.value.page = newPage;
    fetchRoles();
};

// Llama a fetchRoles cuando cambien los valores de paginación o filtro
// watch([pagination, search], fetchRoles);
const clearSearch = () => {
    search.value = '';
    fetchRoles();
};

const showCreateRoleModal = () => {
    selectedRole.value = null;
    roleStore.show_modal_role = true;

};
const showDeleteRoleModal = (role) => {
    selectedRole.value = role;
    roleStore.show_modal_delete = true;
};
const showViewRoleModal = (role) => {
    selectedRole.value = role;
    roleStore.show_modal_view = true;
};
const editRole = (role) => {
    selectedRole.value = role;
    roleStore.show_modal_role = true;
};

const closeModal = () => {
    roleStore.show_modal_role = false;
    fetchRoles();
    fetchPermissions()
};
const closeModalDelete = () => {
    roleStore.show_modal_delete = false;
    fetchRoles();
    fetchPermissions()
};
const closeModalView = () => {
    roleStore.show_modal_view = false;
    fetchRoles();
    fetchPermissions()
};
const fetchPermissions = async () => {
    try {
        console.log('fetchPermissions')
        canCreateRef.value = await globalStore.canCreate(routeName);
    } catch (error) {
        console.error('Error fetching permissions:', error);
    }
};
onMounted(async () => {
    try {

        routes.value = await authStore.userRoutes();
        actions.value = availableActions.value;
        fetchRoles()
        fetchPermissions()
        // console.log('Available Actions:', actions.value);
    } catch (error) {
        console.error('Error fetching role:', error);
    }
});
watch(
    () => roleStore.show_modal_role,
    (newValue) => {
        if (newValue === false) {
            fetchRoles();
            fetchPermissions()
        }
    }
);
// Función para verificar si el usuario puede ver
</script>
<script>
export default {
    name: 'RolePage',
}
</script>
<style scoped>
.role-page {
    padding: 20px;
}

.title-panel-roles {
    font-size: 24px !important;
    font-weight: bold;
    text-transform: none;
}

.title-table-roles {
    font-size: 20px !important;
    font-weight: bold;
    text-transform: none;
}

.description-panel-roles {
    font-size: 18px !important;
    text-transform: none;
}

.chip-status {
    font-size: 12px;
    padding: 9px 10px;
}

.overlapping {
    border: 2px solid white;
    position: absolute;
}
</style>
