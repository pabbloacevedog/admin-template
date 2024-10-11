<template>
    <q-dialog v-model="isOpen" persistent class="container-modal" transition-show="none" transition-hide="none"
        backdrop-filter="blur(4px) saturate(150%)">
        <div class="form-modal-view div-blur div-rounded-radius" :style="dialogStyle">
            <q-card flat class="bg-blur">
                <q-card-section class="q-pa-none">
                    <div class="row justify-center items-center column q-py-xs">
                        <div class="text-center q-mt-xs q-mb-sm">
                            <q-chip :color="role?.color" text-color="white" size="lg" icon="attribution"
                                class="q-px-xl">{{ role?.title }}</q-chip>
                        </div>

                        <q-item-section class="q-pt-md q-mx-md">
                            <q-item-label caption style="font-size: 16px;" class="text-caption">{{ role?.description
                                }}</q-item-label>
                        </q-item-section>
                        <!-- Aquí agregamos los avatares de los usuarios -->
                        <q-item v-if="role?.avatars && role?.avatars.length" class="q-my-sm row q-pb-md"
                            style="padding: 2px 2px;">
                            <q-item-section>
                                <q-item-label class="text-h6">
                                    <div class="flex justify-start">
                                        <div v-if="role?.totalUsers > 1" class="text-h7">
                                            +{{ role?.totalUsers }} users
                                        </div>
                                        <div v-else class="text-h7">
                                            +{{ role?.totalUsers }} user
                                        </div>
                                    </div>
                                </q-item-label>
                            </q-item-section>
                            <div class="q-pl-md flex justify-end">
                                <q-avatar v-for="(rs, n) in role?.avatars" :key="n" size="35px" class="overlapping"
                                    :style="`right: ${n * 15}px`">
                                    <img :src="rs">
                                </q-avatar>
                            </div>
                        </q-item>
                        <q-item-section class="q-pb-md">
                            <q-item-label style="font-size: 18px;" class="text-theme">{{ $t('roles.view.message')
                                }}</q-item-label>
                        </q-item-section>
                    </div>
                </q-card-section>
            </q-card>
            <div class="row q-col-gutter-md q-mx-none q-my-xs ">
                <q-card v-for="route in tableData" :key="route.route_id"
                    class="bg-first div-rounded-radius q-pa-none flex items-end" flat :style="{
                        margin: '0px 10px',
                        width: tableData.length > 1 ? '47%' : '100%' // Si hay más de 1 elemento, usa 46%, sino 100%
                    }">
                    <q-card-section class="q-pa-none">
                        <q-item class="q-mx-none" style="padding: 5px 12px 0px; min-height: 40px;">
                            <q-item-section avatar class="q-pr-none" style="min-width: 48px;">
                                <q-avatar>
                                    <q-icon :name="route.icon" size="28px" :color="role?.color" />
                                </q-avatar>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label style="font-size: 16px;">{{ route.title }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item class="q-ml-xs" style="min-height: min-content !important;padding: 0px 16px 8px;">
                            <q-item-label caption style="font-size: 14px;">{{ route.description }}</q-item-label>
                        </q-item>
                    </q-card-section>

                    <!-- Grid para las acciones -->
                    <q-card-section class="q-pa-none" style="min-width: -webkit-fill-available;">
                        <div class="row q-mb-md q-ml-md q-mr-xl"
                            :style="{ width: tableData.length > 1 ? '95%' : '100%' }">
                            <div v-for="action in route.actions" :key="action.action_id"
                                style="margin: 0px 0px;width: 48% !important;">
                                <q-item dense class="bg-second q-ml-xs q-mb-xs "
                                    style="border-radius: 10px; padding: 5px 8px;">
                                    <q-item-section avatar style="padding-right: 8px; min-width: 24px;">
                                        <q-icon :name="action.icon" style="font-size: 20px;" :color="role?.color" />
                                    </q-item-section>
                                    <q-item-section class="q-mr-md">
                                        <q-item-label>{{ action.title }}</q-item-label>
                                    </q-item-section>
                                    <q-item-section side style="padding-left: 0px !important;">
                                        <q-badge rounded :color="role?.color">{{ action.condition.title }}</q-badge>
                                    </q-item-section>
                                </q-item>
                            </div>
                        </div>
                    </q-card-section>
                </q-card>
            </div>

            <!-- Botones en posición fija usando q-page-sticky -->
            <!-- <q-page-sticky position="bottom" :offset="[0, 50]" class="q-mb-md" v-if="isMobile"> -->
            <div class="flex justify-center q-pt-lg" v-if="isMobile">
                <q-btn :label="$t('roles.view.btn_action')" color="primary" class="btn-border-radius" @click="close" />
            </div>
            <!-- </q-page-sticky> -->
            <div class="flex justify-center q-py-sm" v-else>
                <q-btn :label="$t('roles.view.btn_action')" color="primary" class="btn-border-radius q-px-lg"
                    @click="close" />
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import InputTitleModalView from '../General/InputTitleModalView.vue';
import { useRoleStore } from 'stores/role';
const roleStore = useRoleStore();
const props = defineProps({
    role: {
        type: Object,
        required: true,
    },
});

const emits = defineEmits(['close']);
const dataRole = ref(null);
const $q = useQuasar();
const { t } = useI18n();
const isOpen = ref(true);

const close = () => {
    isOpen.value = false;
    emits('close');
};
// Detectar si es móvil
const isMobile = computed(() => {
    return window.innerWidth <= 600; // Define tu umbral para mobile aquí
});

// Estilo de dialog
const dialogStyle = computed(() => {
    return isMobile.value ? 'width: 100vw; max-width: 100vw; max-height: 100vh !important;height: 98vh;margin: 8px;' : 'width: 900px; max-width: 100vw;';
});
const filter = ref('');
const tableData = ref([]);
const pagination = ref({
    page: 1,    // actual page
    rowsPerPage: 5,
});
const columns = ref([    // define columns
    {
        name: 'name',
        label: 'Route Name',
        align: 'left',
        field: row => row.name,
    },
    {
        name: 'path',
        label: 'Route',
        align: 'left',
        field: row => row.path,
    },
    {
        name: 'actions',
        label: 'Actions',
        align: 'left',
        field: row => row.action, // Se maneja con un slot personalizado
    },
])
onMounted(async () => {
    try {

        dataRole.value = await roleStore.getRoleById(props.role.role_id);
        // Verifica si dataRole tiene la estructura esperada
        if (dataRole.value) {
            const permissions = dataRole.value.permission; // Asegúrate de que estás accediendo correctamente
            console.log('permissions', permissions);
            console.log('dataRole', dataRole.value);
            tableData.value = await loadPermissionsForRole(dataRole.value);
            console.log('tableData', tableData.value);

        } else {
            console.error('permissions is not an array or dataRole is undefined:', dataRole.value);
        }
        console.log('tableData', tableData.value);
    } catch (error) {
        console.error('Error fetching role:', error);
    }
});
const loadPermissionsForRole = async (dataRole) => {
    // Start with an empty array for assigned routes
    const assignedRoutes = [];

    // Iterate over the user's permissions
    dataRole.permission.forEach(permission => {
        permission.route.forEach(route => {
            // Check if the route already exists in assignedRoutes
            const existingRouteIndex = assignedRoutes.findIndex(r => r.route_id === route.route_id);

            // Create the action object with the condition_id
            route.action.forEach(action => {
                let condition = {
                    name: action.condition.name,
                    title: action.condition.title,
                    description: action.condition.description,
                    condition_id: action.condition.condition_id,
                };
                const actionAdd = {
                    action_id: action.action_id,
                    route_id: route.route_id,
                    condition: condition, // Assuming condition is used for condition_id
                    icon: action.icon,
                    title: action.title,
                    description: action.description
                };
                // If the route exists, update its actions
                if (existingRouteIndex !== -1) {
                    // Check if actions array exists, if not, initialize it
                    if (!assignedRoutes[existingRouteIndex].actions) {
                        assignedRoutes[existingRouteIndex].actions = [];
                    }
                    // Add action to the existing route's actions
                    assignedRoutes[existingRouteIndex].actions.push(actionAdd);
                } else {
                    // If the route does not exist, create a new route entry
                    const newRouteEntry = {
                        route_id: route.route_id,
                        name: route.name,
                        title: route.title,
                        description: route.description, // Include the description if needed
                        path: route.path,
                        icon: route.icon,
                        module_id: route.module_id,
                        actions: [actionAdd] // Initialize with the current action
                    };
                    // Push the new route entry to assignedRoutes
                    assignedRoutes.push(newRouteEntry);
                }
            });
        });
    });

    // Return the array with the assigned routes and actions
    return assignedRoutes;
};
</script>
<script>
export default {
    name: 'RoleViewModal',
}
</script>
<style scoped>
@media (max-width: 855px) {
    .text-message-delete {
        font-size: 28px;
        font-weight: 300;
    }

    .btn-verified-view {
        height: 60px !important;
        width: 100%;
    }

    .label-role-view {
        font-size: 14px;
        ;
    }
}

.chip-status-view {
    font-size: 16px;
    padding: 9px 10px;
}

.chip-verified-view {
    font-size: 18px;
    padding: 9px 10px;
    background: #ffffff00 !important;
}

.chip-noverified-view {
    font-size: 18px;
    padding: 9px 10px;
    background: #ffffff00 !important;
}

/* Estilo para pantallas pequeñas: ratio libre */
@media (min-width: 855px) {

    .text-message-delete {
        font-size: 24px;
        font-weight: 300;
        max-width: 80%;

    }

    .label-role-view {
        font-size: 18px;
        ;
    }

    .btn-verified-view {
        height: 62px !important;
        width: 100%;
    }
}

.input-form {
    padding: 0px 0px 4px 0px;
}

.input-bottom-view {
    padding: 0px 0px 10px 0px;
}
</style>
