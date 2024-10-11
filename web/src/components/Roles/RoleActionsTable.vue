<template>
    <div style="display: flex; align-items: center;">
        <q-btn v-if="canUpdateRef" class="bg-white q-mr-sm" round flat size="sm" :color="color" @click="edit(resource)" >
            <q-icon :class="color" name="edit" />
        </q-btn>
        <q-btn v-if="canDeleteRef" class="bg-white q-mr-sm"  flat size="sm" round :color="color"
            @click="showDeleteModal(resource)" >
            <q-icon :class="color" name="delete_outline" />
        </q-btn>
        <q-btn v-if="canViewRef" class="bg-white" flat size="sm" round :color="color" @click="showViewModal(resource)">
            <q-icon :class="color" name="visibility" />
        </q-btn>
    </div>
</template>

<script setup>
import { useGlobalStore } from 'stores/global';
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
const globalStore = useGlobalStore();
const route = useRoute();
const props = defineProps({
    edit: Function,
    showDeleteModal: Function,
    showViewModal: Function,
    resource: {
        type: Object,
        default: () => ({}),
    },
    color: String // Color del botón
});
const routeName = route.name; // Capturar el nombre de la ruta
// Definir refs para los permisos
const canDeleteRef = ref(false);
const canUpdateRef = ref(false);
const canViewRef = ref(false);
const fetchPermissions = async () => {
    try {
        canDeleteRef.value = await globalStore.canDelete(props.resource, routeName);
        canUpdateRef.value = await globalStore.canUpdate(props.resource, routeName);
        canViewRef.value = await globalStore.canView(props.resource, routeName);
    } catch (error) {
        console.error('Error fetching permissions:', error);
    }
};
// Llamar a la función para obtener los permisos al montar el componente
onMounted(fetchPermissions);
console.log('canDelete', canDeleteRef)
console.log('canUpdate', canUpdateRef)
</script>
<script>
export default {
    name: 'RoleActionsTable',
}
</script>
