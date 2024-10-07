<template>
    <q-dialog v-model="isOpen" persistent class="container-modal" transition-show="none" transition-hide="none"
        backdrop-filter="blur(4px) saturate(150%)">
        <div class="form-modal-view div-blur div-rounded-radius" :style="dialogStyle">
            <q-card v-for="route in tableData" :key="route.route_id" class="q-mb-md">
                <q-card-section>
                    <q-expansion-item :label="`Route: ${route.name}`" expand-separator :default-opened="true">
                        <template v-slot:header>
                            <q-item>
                                <q-item-section>
                                    <q-item-label>{{ route.name }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>

                        <q-list>
                            <q-item v-for="action in route.action" :key="action.action_id" class="q-mb-sm">
                                <q-item-section>
                                    <q-item-label>
                                        {{ action.name }}
                                        <q-badge color="primary" label="Action" />
                                    </q-item-label>
                                    <q-item-label caption>
                                        {{ action.condition.title }}: {{ action.condition.description }}
                                    </q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-expansion-item>
                </q-card-section>
            </q-card>

            <!-- Botones en posición fija usando q-page-sticky -->
            <!-- <q-page-sticky position="bottom" :offset="[0, 50]" class="q-mb-md" v-if="isMobile"> -->
            <div class="flex justify-center q-pt-lg" v-if="isMobile">
                <q-btn :label="$t('roles.view.btn_action')" color="primary" class="btn-border-radius" @click="close" />
            </div>
            <!-- </q-page-sticky> -->
            <div class="flex justify-center q-pb-lg" v-else>
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
    return isMobile.value ? 'width: 100vw; max-width: 100vw; max-height: 100vh !important;height: 98vh;margin: 8px;' : 'width: 1000px; max-width: 100vw;';
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

            // Crear un objeto para almacenar las rutas y sus acciones
            const routesMap = new Map();

            permissions.forEach(permission => {
                if (permission.route) {
                    permission.route.forEach(route => {
                        // Verificamos si la ruta ya está en el mapa
                        if (!routesMap.has(route.route_id)) {
                            // Si no está, la agregamos al mapa
                            routesMap.set(route.route_id, {
                                route_id: route.route_id,
                                name: route.title, // Cambiado a 'name' para cumplir con la estructura deseada
                                path: route.path,
                                action: [] // Inicializa un arreglo para las acciones
                            });
                        }

                        // Ahora, agregamos las acciones a la ruta correspondiente
                        route.action.forEach(action => {
                            // Aquí se agregan las acciones a la ruta correspondiente
                            routesMap.get(route.route_id).action.push({
                                action_id: action.action_id,
                                name: action.title, // Cambiado a 'name' para cumplir con la estructura deseada
                                condition: action.condition // Presupone que 'condition' ya está estructurado como deseas
                            });
                        });
                    });
                }
            });

            // Convertir el mapa a un arreglo para la tabla
            tableData.value = Array.from(routesMap.values());
            console.log('tableData', tableData.value);

        } else {
            console.error('permissions is not an array or dataRole is undefined:', dataRole.value);
        }
        console.log('tableData', tableData.value);
    } catch (error) {
        console.error('Error fetching role:', error);
    }
});
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
