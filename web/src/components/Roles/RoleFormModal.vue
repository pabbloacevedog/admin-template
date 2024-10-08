<template>
    <q-dialog v-model="roleStore.show_modal_role" @hide="resetForm" backdrop-filter="blur(4px) saturate(150%)"
        class="container-modal" :fullscreen="true" transition-show="none" transition-hide="none" :maximized="true">
        <div class="q-py-xs form-modal div-blur div-rounded-radius h-form" :style="dialogStyle">
            <q-card flat
                style="flex-grow: 1; display: flex; flex-direction: column;" class="bg-blur">
                <q-card-header>
                    <q-toolbar class="div-rounded-radius">
                        <q-toolbar-title>
                            <SubTitleSettingsPanel
                                :subtitle="isEdit ? $t('roles.edit.title') : $t('roles.create.title')"
                                :description="isEdit ? $t('roles.edit.description') : $t('roles.create.description')"
                                :icon="isEdit ? 'supervisor_account' : 'person_add'" />
                        </q-toolbar-title>
                        <q-btn round flat icon="close" @click="close" />
                    </q-toolbar>
                </q-card-header>
                <q-card-section class="col-4 q-pr-md q-pl-none q-pb-none q-pt-sm" style="padding: 24px 2%;"
                    v-if="isMobile">
                    <div caption class="q-mt-md q-mb-xl " v-if="isEdit" style="font-size: 16px;">
                        {{ $t('roles.edit.instruction') }}
                    </div>
                    <div caption class="q-mt-md q-mb-xl" v-else style="font-size: 16px;">
                        {{ $t('roles.create.instruction') }}
                    </div>
                    <q-input disable class="q-mt-md q-mb-none" filled v-model="form.name"
                        :label="$t('roles.account.name.title')" type="text" autocomplete="name" :error="errors.name"
                        :error-message="errors.nameMsg" />
                    <q-input dense class="q-mt-none q-mb-none" filled v-model="form.title"
                        :label="$t('roles.account.title.title')" type="text" :error="errors.title" @input="generateName"
                        :error-message="errors.titleMsg" />
                    <q-input class="q-mt-md q-mb-none description-role" filled v-model="form.description"
                        :label="$t('roles.account.description.title')" type="textarea" rows="4" />
                    <div class="flex justify-center q-mt-lg ">
                        <q-btn v-for="(colorOption, index) in colorOptions" :key="index" round
                            :style="{ backgroundColor: colorOption.color, position: 'relative' }"
                            :outline="form.color !== colorOption.value" :flat="form.color !== colorOption.value"
                            @click="form.color = colorOption.value" class="q-mr-xs">
                            <!-- Si el color está seleccionado, se muestra el ícono de verificación -->
                            <q-icon v-if="form.color === colorOption.value" name="check" color="white"
                                style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" />
                        </q-btn>
                    </div>
                    <!-- Mensaje de error si no selecciona color -->
                    <div v-if="errors.color" class="text-negative q-mt-sm">
                        {{ errors.colorMsg }}
                    </div>
                    <div class="q-pt-lg" v-if="isMobile">
                        <q-btn :label="$t('roles.create.btn_cancel')" outline color="primary"
                            class="btn-border-radius q-mr-lg" @click="close" />
                        <q-btn :label="isEdit ? $t('roles.edit.btn_action') : $t('roles.create.btn_action')"
                            color="primary" class="btn-border-radius" @click="submit" />
                    </div>
                </q-card-section>
                <q-card-section class="col-8 q-pl-none q-pr-xs q-pt-none q-pt-lg q-pb-none "
                    style="max-height: 85vh; overflow-y: auto;padding: 4px 1%;" v-if="isMobile">
                    <q-card class="q-mb-md div-rounded-radius bg-blur q-pa-xs" flat v-for="route in routes"
                        :key="route.route_id">
                        <q-item>
                            <q-item-section avatar class="q-pr-none" style="min-width: 48px;">
                                <q-avatar>
                                    <q-icon :name="route.icon" size="28px" />
                                </q-avatar>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label style="font-size: 16px;">{{ route.title }}</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                                <q-checkbox size="md" @update:model-value="toggleRoute(route)" v-model="route_roles"
                                    :val="route.route_id" />
                            </q-item-section>
                        </q-item>

                        <q-item v-if="includesRouteId(route.route_id)" class="q-ml-sm"
                            style="min-height: min-content !important; padding: 0px 0px 0px 16px;">
                            <q-item-label caption style="font-size: 14px;">{{ route.description }}</q-item-label>
                        </q-item>
                        <q-item v-else class="q-ml-sm"
                            style="min-height: min-content !important; padding: 0px 0px 16px 16px;">
                            <q-item-label caption style="font-size: 14px;">{{ route.description }}</q-item-label>
                        </q-item>
                        <!-- Se muestra solo si la ruta está seleccionada -->
                        <q-list v-if="includesRouteId(route.route_id)">
                            <q-item class="q-ma-none row"
                                style="min-height: min-content !important; max-width: 100vw !important;">
                                <q-item-section v-for="action in actions" :key="action.action_id" class="col-6">
                                    <q-item class="q-pa-none">
                                        <q-item-section avatar class="q-pr-none" style="min-width: 48px;">
                                            <q-avatar>
                                                <q-icon :name="action.icon" size="24px" />
                                            </q-avatar>
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label style="font-size: 14px;">{{ action.title
                                                }}</q-item-label>
                                        </q-item-section>
                                        <q-item-section side>
                                            <q-toggle v-model="action_roles"
                                                :val="`${route.route_id}_${action.action_id}`"
                                                @update:model-value="toggleAction(route.route_id, action)"
                                                color="primary" />
                                        </q-item-section>
                                    </q-item>
                                    <q-item class="q-py-none q-px-xs">
                                        <q-item-section>
                                            <q-select dense filled
                                                v-model="actionConditions[`${route.route_id}_${action.action_id}`]"
                                                :options="conditions" label="Condition" option-label="label"
                                                option-value="value"
                                                @update:model-value="(newValue) => selectCondition(route.route_id, action, newValue)"
                                                :disable="!isActionSelected(route.route_id, action.action_id)">
                                            </q-select>
                                        </q-item-section>
                                    </q-item>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card>

                </q-card-section>
                <q-card-section class="q-py-none" v-else horizontal>
                    <q-card-section class="col-4 q-pr-md q-pl-none q-pb-none q-pt-sm" style="padding: 24px 2%;">
                        <div caption class="q-mt-md q-mb-xl " v-if="isEdit" style="font-size: 16px;">
                            {{ $t('roles.edit.instruction') }}
                        </div>
                        <div caption class="q-mt-md q-mb-xl" v-else style="font-size: 16px;">
                            {{ $t('roles.create.instruction') }}
                        </div>
                        <q-input dense disable class="q-mt-md q-mb-none" filled v-model="form.name"
                            :label="$t('roles.account.name.title')" type="text" autocomplete="name" :error="errors.name"
                            :error-message="errors.nameMsg" />
                        <q-input dense class="q-mt-none q-mb-none" filled v-model="form.title"
                            :label="$t('roles.account.title.title')" type="text" :error="errors.title"
                            @update:model-value="generateName" :error-message="errors.titleMsg" />
                        <q-input class="q-mt-md q-mb-none description-role" filled v-model="form.description"
                            :label="$t('roles.account.description.title')" type="textarea" rows="4"
                            :error="errors.description" :error-message="errors.descriptionMsg" />
                        <div class="flex justify-center q-mt-lg ">
                            <q-btn v-for="(colorOption, index) in colorOptions" :key="index" round
                                :style="{ backgroundColor: colorOption.color, position: 'relative' }"
                                :outline="form.color !== colorOption.value" :flat="form.color !== colorOption.value"
                                @click="form.color = colorOption.value" class="q-mr-xs">
                                <!-- Si el color está seleccionado, se muestra el ícono de verificación -->
                                <q-icon v-if="form.color === colorOption.value" name="check" color="white"
                                    style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" />
                            </q-btn>
                            <!-- Mensaje de error si no selecciona color -->
                            <div v-if="errors.color" class="text-negative q-mt-sm">
                                {{ errors.colorMsg }}
                            </div>

                            <div class="q-pt-xl" v-if="!isMobile">
                                <q-btn :label="$t('roles.create.btn_cancel')" outline color="primary"
                                    class="btn-border-radius q-mr-lg" @click="close" />
                                <q-btn :label="isEdit ? $t('roles.edit.btn_action') : $t('roles.create.btn_action')"
                                    color="primary" class="btn-border-radius" @click="submit" />
                            </div>
                        </div>
                    </q-card-section>
                    <q-card-section class="col-8 q-pl-none q-pr-xs q-pt-none q-pt-lg q-pb-none "
                        style="max-height: 85vh; overflow-y: auto;padding: 24px 4%;">
                        <q-card  class="q-mb-md bg-first div-rounded-radius q-pa-xs" flat v-for="route in routes"
                            :key="route.route_id">
                            <q-item>
                                <q-item-section avatar class="q-pr-none" style="min-width: 48px;">
                                    <q-avatar>
                                        <q-icon :name="route.icon" size="28px" />
                                    </q-avatar>
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label style="font-size: 16px;">{{ route.title }}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-checkbox size="md" @update:model-value="toggleRoute(route)" v-model="route_roles"
                                        :val="route.route_id" />
                                </q-item-section>
                            </q-item>

                            <q-item v-if="includesRouteId(route.route_id)" class="q-ml-sm"
                                style="min-height: min-content !important; padding: 0px 0px 0px 16px;">
                                <q-item-label caption style="font-size: 14px;">{{ route.description }}</q-item-label>
                            </q-item>
                            <q-item v-else class="q-ml-sm"
                                style="min-height: min-content !important; padding: 0px 0px 16px 16px;">
                                <q-item-label caption style="font-size: 14px;">{{ route.description }}</q-item-label>
                            </q-item>
                            <!-- Se muestra solo si la ruta está seleccionada -->
                            <q-list v-if="includesRouteId(route.route_id)">
                                <q-item class="q-ma-none" style="min-height: min-content !important;">
                                    <q-item-section v-for="action in actions" :key="action.action_id">
                                        <q-item class="q-pa-none">
                                            <q-item-section avatar class="q-pr-none" style="min-width: 48px;">
                                                <q-avatar>
                                                    <q-icon :name="action.icon" size="24px" />
                                                </q-avatar>
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label style="font-size: 14px;">{{ action.title
                                                    }}</q-item-label>
                                            </q-item-section>
                                            <q-item-section side>
                                                <q-toggle v-model="action_roles"
                                                    :val="`${route.route_id}_${action.action_id}`"
                                                    @update:model-value="toggleAction(route.route_id, action)"
                                                    color="primary" />
                                            </q-item-section>
                                        </q-item>
                                        <q-item class="q-py-none q-px-xs">
                                            <q-item-section>
                                                <!-- <q-select dense filled v-model="selectedConditions"
                                                    :options="conditions" label="Condition" ption-label="label"
                                                    option-value="value"
                                                    :disable="!isActionSelected(route.route_id, action.action_id)">
                                                </q-select> -->
                                                <q-select dense filled
                                                    v-model="actionConditions[`${route.route_id}_${action.action_id}`]"
                                                    :options="conditions" label="Condition" option-label="label"
                                                    option-value="value"
                                                    @update:model-value="(newValue) => selectCondition(route.route_id, action, newValue)"
                                                    :disable="!isActionSelected(route.route_id, action.action_id)">
                                                </q-select>
                                            </q-item-section>
                                        </q-item>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-card>

                    </q-card-section>
                </q-card-section>
            </q-card>

        </div>
    </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import SubTitleSettingsPanel from 'components/AccountUser/SubTitleSettingsPanel.vue';
import { useRoleStore } from 'stores/role';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const $q = useQuasar();
const roleStore = useRoleStore();

const props = defineProps({
    role: {
        type: Object,
        default: () => ({}),
    },
});
const colorOptions = ref([
    { label: 'Coral Red', value: 'role-color-1', color: '#FF6B6B' },
    { label: 'Aqua Mint', value: 'role-color-2', color: '#076ea9' },
    { label: 'Mustard Yellow', value: 'role-color-3', color: '#5925cd' },
    { label: 'Dark Teal', value: 'role-color-4', color: '#1A535C' },
    { label: 'Vibrant Orange', value: 'role-color-5', color: '#FF9F1C' },
    { label: 'Royal Purple', value: 'role-color-6', color: '#6A4C93' },
    { label: 'Turquoise', value: 'role-color-7', color: '#2EC4B6' },
    { label: 'Raspberry Pink', value: 'role-color-8', color: '#D90368' },
    { label: 'Bright Blue', value: 'role-color-9', color: '#3A86FF' },
    { label: 'Electric Violet', value: 'role-color-10', color: '#8338EC' }
]);
const condition = ref('');
const role = ref(props.role);
const form = ref({
    role_id: '',
    name: '',
    title: '',
    description: '',
    color: '',
});


const routes = ref([]);
const actions = ref([]);
// const conditions = ref([]);
const isEdit = ref(false);
const search = ref('');
const pagination = ref({ page: 1, rowsPerPage: 10 }); // Define la paginación
const roleConfig = ref({});
const assignedRoutes = ref({}); // Almacena las condiciones asignadas
const assignedActions = ref({}); // Almacena las acciones asignadas
const dataRole = ref(null);
const route_roles = ref([]);
const action_roles = ref([]);
const condition_roles = ref(null);
const selectedRoutes = ref([]); // Almacena los route_id seleccionados
const selectedActions = ref([]); // Almacena las acciones seleccionadas
const selectedConditions = ref({}); // Almacena la condición seleccionada= ref({}); // Almacena las condiciones seleccionadas para cada acción
const actionConditions = ref({});
const conditions = ref([]); // Almacena las condiciones

const errors = ref({
    name: false,
    nameMsg: '',
    title: false,
    titleMsg: '',
    description: false,
    descriptionMsg: '',
    color: false,
    colorMsg: ''
});
const validateForm = () => {
    let isValid = true;

    if (!form.value.name) {
        errors.value.name = true;
        errors.value.nameMsg = t('roles.errors.name_required');
        isValid = false;
    } else if (form.value.name.length < 3) {
        errors.value.name = true;
        errors.value.nameMsg = t('roles.errors.name_min_length');
        isValid = false;
    } else {
        errors.value.name = false;
        errors.value.nameMsg = '';
    }

    if (!form.value.title) {
        errors.value.title = true;
        errors.value.titleMsg = t('roles.errors.title_required');
        isValid = false;
    } else if (form.value.title.length < 3) {
        errors.value.title = true;
        errors.value.titleMsg = t('roles.errors.title_min_length');
        isValid = false;
    } else {
        errors.value.title = false;
        errors.value.titleMsg = '';
    }
    // Validación de la descripción (es requerida)
    if (!form.value.description) {
        errors.value.description = true;
        errors.value.descriptionMsg = t('roles.errors.description_required');
        isValid = false;
    } else {
        errors.value.description = false;
        errors.value.descriptionMsg = '';
    }

    // Validación de color (es requerido)
    if (!form.value.color) {
        errors.value.color = true;
        errors.value.colorMsg = t('roles.errors.color_required');
        isValid = false;
    } else {
        errors.value.color = false;
        errors.value.colorMsg = '';
    }
    return isValid;
};

// Detectar si es móvil
const isMobile = computed(() => {
    return window.innerWidth <= 600;
});
// Verifica si el route_id está en selectedRoutes
const includesRouteId = (route_id) => {
    // console.log('selectedRoutes', selectedRoutes.value)
    return selectedRoutes.value.some(route => route.route_id === route_id);
};
// Función para generar el 'name' automáticamente
const generateName = () => {
    form.value.name = normalizeText(form.value.title);
};

// Función para normalizar el texto
const normalizeText = (text) => {
    return text
        .toLowerCase() // Convertir a minúsculas
        .normalize("NFD") // Normalizar para eliminar acentos
        .replace(/[\u0300-\u036f]/g, "") // Eliminar los acentos
        .replace(/[.,]/g, "") // Eliminar puntos y comas
        .replace(/\s+/g, "_") // Reemplazar espacios por guiones bajos
        .replace(/[^a-z0-9_]/g, ""); // Eliminar cualquier otro carácter especial
};
// Añade o remueve el route_id cuando se hace toggle en el checkbox de ruta
const toggleRoute = (route) => {
    if (includesRouteId(route.route_id)) {
        // Elimina la ruta y todas sus acciones asociadas
        selectedRoutes.value = selectedRoutes.value.filter(r => r.route_id !== route.route_id);
        selectedActions.value = selectedActions.value.filter(action => !action.route_id);
        // Elimina las condiciones asociadas
    } else {
        // Añade la ruta
        // Crear una copia del objeto route
        const routeCopy = { ...route };

        // Eliminar __typename si existe en la copia
        if (routeCopy.__typename) {
            delete routeCopy.__typename;
        }

        console.log('role a agregar ', routeCopy);

        // Añadir la ruta al array
        selectedRoutes.value.push(routeCopy);
    }
    console.log('routes_role', route_roles.value)
    console.log('action_roles', action_roles.value)
};

// Verifica si una acción está seleccionada
const isActionSelected = (route_id, action_id) => {
    // console.log('selectedActions', selectedActions.value)
    return selectedActions.value.some(action =>
        action.route_id === route_id && action.action_id === action_id
    );
};


// Añade o remueve una acción cuando se hace toggle en el botón de acción
const toggleAction = (route_id, action) => {
    if (isActionSelected(route_id, action.action_id)) {
        // Remove the action
        selectedActions.value = selectedActions.value.filter(act => act.action_id !== action.action_id);
        const route = selectedRoutes.value.find(route => route.route_id === route_id);

        if (route && route.actions) {
            // Remove the action from the list of actions for this route
            route.actions = route.actions.filter(a => a.action_id !== action.action_id);

            // If there are no more actions in the route, you can choose to delete the property 'actions'
            if (route.actions.length === 0) {
                delete route.actions;
            }
        }

        // Optionally, remove the condition when the action is deselected
        delete actionConditions.value[`${route_id}_${action.action_id}`];

    } else {
        var actionAdd = {
            action_id: action.action_id,
            route_id: route_id,
            icon: action.icon,
            title: action.title,
            description: action.description
        };
        // Add the action to selectedActions
        selectedActions.value = selectedActions.value.concat(actionAdd);
        // Encuentra la ruta correspondiente en selectedRoutes
        const routeIndex = selectedRoutes.value.findIndex(route => route.route_id === route_id);

        if (routeIndex !== -1) {
            // Verifica si el route ya tiene una lista de acciones, si no, crea una
            if (!selectedRoutes.value[routeIndex].actions) {
                selectedRoutes.value[routeIndex] = {
                    ...selectedRoutes.value[routeIndex],
                    actions: []
                };
            }

            // Añade actionAdd a la lista de acciones de esta ruta
            selectedRoutes.value[routeIndex].actions.push(actionAdd);
        }
    }
};
// Función para alternar el estado de las acciones
const selectCondition = (route_id, action, condition) => {
    // Find the route by route_id
    const route = selectedRoutes.value.find(route => route.route_id === route_id);

    if (route && route.actions) {
        // Find the action in the route's actions by action_id
        const actionToUpdate = route.actions.find(a => a.action_id === action.action_id);

        if (actionToUpdate) {
            // Update the condition_id of the found action
            const con = {
                condition_id: condition.condition_id,
                name: condition.name,
                title: condition.title,
                description: condition.description
            }
            actionToUpdate.condition = con;
        }
    }
    // console.log('selectedRoutes', selectedRoutes.value)
    // console.log('selectedActions', selectedActions.value)
    // console.log('action_roles', action_roles.value)
    // console.log('actionConditions', actionConditions.value)
};
// Estilo de dialog
const dialogStyle = computed(() => {
    return isMobile.value ? 'width: 100vw; max-width: 100vw; max-height: 100vh !important;height: 98vh;margin: 8px;' : 'width: 100vw;; max-width: 100vw;';
});

// Cargar roles y preparar el formulario al montar
onMounted(async () => {
    await fetchRoles();
    roleConfig.value = await roleStore.getRoleConfigData();
    routes.value = roleConfig.value.routes;
    actions.value = roleConfig.value.actions;
    conditions.value = roleConfig.value.conditions.map(condition => ({
        label: condition.title,    // Lo que se muestra en el select
        value: condition.condition_id,  // El valor que se selecciona (role_id)
        name: condition.name,
        condition_id: condition.condition_id,
    }));
    selectedConditions.value = {
        label: 'all',
        value: 2,
    }
    if (role.value && role.value.role_id) {
        form.value = { ...role.value };
        isEdit.value = true;
        dataRole.value = await roleStore.getRoleById(props.role.role_id);
        assignedRoutes.value = await loadPermissionsForRole(dataRole.value);
        // Make sure selectedRoutes is properly set
        selectedRoutes.value = JSON.parse(JSON.stringify(assignedRoutes.value)); // Deep copy to maintain reactivity

        // Update selectedActions and selectedConditions
        selectedActions.value = assignedRoutes.value.flatMap(route => route.actions || []);
        selectedConditions.value = assignedRoutes.value.flatMap(route =>
            route.actions ? route.actions.map(action => action.condition) : []
        );
        console.log('assignedRoutes', assignedRoutes.value)
        console.log('actionConditions', actionConditions.value)
    } else {
        resetForm();
        isEdit.value = false;
    }
});
const loadPermissionsForRole = async (dataRole) => {
    // Start with an empty array for assigned routes
    const assignedRoutes = [];

    // Iterate over the user's permissions
    dataRole.permission.forEach(permission => {
        permission.route.forEach(route => {
            // se asignan las rutas a las acciones de la ui
            route_roles.value[route.route_id] = route.route_id;
            // Check if the route already exists in assignedRoutes
            const existingRouteIndex = assignedRoutes.findIndex(r => r.route_id === route.route_id);

            // Create the action object with the condition_id
            route.action.forEach(action => {
                //se asigan las acciones a las rutas de la ui
                action_roles.value = action_roles.value.concat(`${route.route_id}_${action.action_id}`);
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
                //se asignan las condiciones a las acciones de la ui
                actionConditions.value[`${route.route_id}_${action.action_id}`] = {
                    label: action.condition.title,    // Lo que se muestra en el select
                    value: action.condition.condition_id,  // El valor que se selecciona (role_id)
                    name: action.condition.name,
                    condition_id: action.condition.condition_id,
                }
                // actionConditions.value = actionConditions.value.concat(`${route.route_id}_${action.action_id}`);
                // If the route exists, update its actions
                if (existingRouteIndex !== -1) {
                    // Check if actions array exists, if not, initialize it
                    if (!assignedRoutes[existingRouteIndex].actions) {
                        assignedRoutes[existingRouteIndex].actions = [];
                    }
                    // Add action to the existing route's actions
                    assignedRoutes[existingRouteIndex].actions.push(actionAdd);
                    selectedActions.value = selectedActions.value.concat(actionAdd);
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
// Función para obtener todos los roles
const fetchRoles = async () => {
    try {
        const response = await roleStore.getAllRoles(search.value, pagination.value.page, pagination.value.rowsPerPage);
        // Maneja la respuesta según tus necesidades, por ejemplo, actualiza una lista de roles
        // console.log(response);
    } catch (error) {
        console.error('Error fetching roles:', error);
    }
};

// Cerrar y resetear el formulario
const close = () => {
    roleStore.show_modal_role = false;
    resetForm();
};

// Resetear el formulario
const resetForm = () => {
    form.value = {
        name: '',
        title: '',
        description: '',
        color: '',
        role_id: '',
    };
    isEdit.value = false;
};

// Manejar la acción de submit (crear o editar usuario)
const submit = async () => {
    if (!validateForm()) {
        $q.notify({
            type: 'negative',
            message: t('roles.errors.fix_errors'),
        });
        return;
    }

    $q.loading.show();
    console.log('Those are the al permission of the role ', selectedRoutes.value);
    form.value.permission = selectedRoutes.value;
    if (isEdit.value) {
        // console.log('edit data ', form.value);
        delete form.value.avatars;
        delete form.value.totalUsers;
        delete form.value.__typename;
        await roleStore.updateRole(form.value).then(response => {
            console.log('response: ' + response);
            $q.notify({
                type: 'positive',
                message: response,
            });
        }).catch(error => {
            console.log('error catch: ' + error);
        });
    } else {
        console.log('create data ', form.value);
        try {
            form.value.permission = selectedRoutes.value;
            const newRole = await roleStore.createRole(form.value);
            $q.notify({
                type: 'positive',
                message: newRole.message,
            });
            close();
        } catch (error) {
            console.error('Error creating role:', error);
            $q.notify({
                type: 'negative',
                message: error.message || t('roles.errors.create_failed'),
            });
        }
    }
    $q.loading.hide();
    close();
};
</script>
<script>
export default {
    name: 'RoleFormModal',
}
</script>
<style scoped>
/* Aquí puedes agregar estilos personalizados */
.container-modal {
    backdrop-filter: blur(5px) saturate(180%);
}

.div-blur {
    background: rgba(255, 255, 255, 0.5);
}

.input-form {
    padding: 0px 0px 4px 0px;
}

.input-bottom {
    padding: 0px 0px 20px 0px;
}

@media (max-width: 855px) {

    .form-modal {
        padding: 0px 0px;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .btn-password-edit {
        height: 40px !important;
        width: 100%;
        font-size: 12px;
    }

    .btn-verified-edit {
        height: 60px !important;
        width: 100%;
    }

    .input-password-edit {
        width: 75%;
        padding: 0px;
    }

    .input-label-edit {
        height: 60px !important;
    }

    .btn-password-back {
        padding: 0px 8px;
        margin-right: 8px;
    }
}

/* Estilo para pantallas pequeñas: ratio libre */
@media (min-width: 855px) {
    .form-modal {
        padding: 16px 5%;

    }

    .btn-password-edit {
        height: 56px !important;
        width: 100%;
    }

    .btn-verified-edit {
        height: 76px !important;
        width: 100%;
    }

    .input-label-edit {
        height: 76px !important;
    }

    .input-password-edit {
        width: 82%;
        padding: 0px;
    }

    .btn-password-back {
        padding: 0px 20px;
        margin-right: 8px;
    }
}
</style>
