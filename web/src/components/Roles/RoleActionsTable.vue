<template>
    <div style="display: flex; align-items: center;" class="q-pt-xs">
        <q-btn v-if="canEdit" class="bg-first q-mr-sm" style="border-radius: 8px;" round flat size="sm" :color="color" @click="edit(resource)" >
            <q-icon :class="color" name="edit" />
        </q-btn>
        <q-btn v-if="canDelete" class="bg-first q-mr-sm" style="border-radius: 8px;" flat size="sm" round :color="color"
            @click="showDeleteModal(resource)" >
            <q-icon :class="color" name="delete_outline" />
        </q-btn>
        <q-btn v-if="canView" class="bg-first" style="border-radius: 8px;" flat size="sm" round :color="color" @click="showViewModal(resource)">
            <q-icon :class="color" name="visibility" />
        </q-btn>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from 'stores/auth';
const authStore = useAuthStore();
const props = defineProps({
    edit: Function,
    showDeleteModal: Function,
    showViewModal: Function,
    resource: {
        type: Object,
        default: () => ({}),
    },
    permissions: Array, // Array que contiene los permisos del usuario
    color: String // Color del botón
});
console.log('props', props)
// Función para verificar si el usuario puede editar
const canEdit = computed(() => {
    // Comprobar si el usuario tiene la acción "update" y la condición necesaria
    const updatePermission = props.permissions.find(permission => permission.name === 'update');

    if (!updatePermission) return false; // Si no tiene permiso de actualización, no puede editar

    // Verificar la condición para el permiso
    const condition = updatePermission.condition;
    if (condition.name === 'all') {
        return true; // Puede editar cualquier recurso
    }

    if (condition.name === 'owner_only') {
        // Comprueba si el usuario es el propietario
        return isOwner(); // Implementar esta función según la lógica de tu app
    }

    return false; // Por defecto, no puede editar
});

// Función para verificar si el usuario puede eliminar
const canDelete = computed(() => {
    // El usuario no puede eliminar su propio role
    if (props.resource.role_id == authStore.user.role?.role_id) return false;
    // Lógica similar a canEdit, puedes definir otro conjunto de permisos
    const deletePermission = props.permissions.find(permission => permission.name === 'delete');

    if (!deletePermission) return false; // Si no tiene permiso de eliminación, no puede eliminar

    const condition = deletePermission.condition;
    if (condition.name === 'all') {
        return true; // Puede eliminar cualquier recurso
    }

    if (condition.name === 'owner_only') {
        return isOwner(); // Implementar esta función según la lógica de tu app
    }

    return false; // Por defecto, no puede eliminar
});
// Función para verificar si el usuario puede eliminar
const canView = computed(() => {
    // Lógica similar a canEdit, puedes definir otro conjunto de permisos
    const viewPermission = props.permissions.find(permission => permission.name === 'view');

    if (!viewPermission) return false; // Si no tiene permiso de eliminación, no puede eliminar

    const condition = viewPermission.condition;
    if (condition.name === 'all') {
        return true; // Puede eliminar cualquier recurso
    }

    if (condition.name === 'owner_only') {
        return isOwner(); // Implementar esta función según la lógica de tu app
    }

    return false; // Por defecto, no puede eliminar
});
// Implementa esta función según la lógica de tu aplicación
function isOwner() {
    // Lógica para determinar si el usuario actual es el propietario del recurso
    // Por ejemplo, comparar IDs de usuario o cualquier otro método necesario
    return props.resource.user_id === authStore.user?.user_id || props.resource.owner_id === authStore.user?.user_id  // Ajusta esto según tu lógica
}
</script>
<script>
export default {
    name: 'RoleActionsTable',
}
</script>
