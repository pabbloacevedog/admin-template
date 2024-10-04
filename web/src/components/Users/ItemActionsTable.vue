<template>
    <div>
        <q-btn
            v-if="canEdit"
            round
            icon="edit"
            flat
            size="md"
            @click="editUser(user)" />
        <q-btn
            v-if="canDelete"
            flat
            size="md"
            round
            icon="delete_outline"
            @click="showDeleteUserModal(user)" />
        <q-btn
        v-if="canView"
            flat
            size="md"
            round
            icon="visibility"
            @click="showViewUserModal(user)" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from 'stores/auth';
const authStore = useAuthStore();
const props = defineProps({
    editUser: Function,
    showDeleteUserModal: Function,
    showViewUserModal: Function,
    user: {
        type: Object,
        default: () => ({}),
    },
    userPermissions: Array // Array que contiene los permisos del usuario
});

// Función para verificar si el usuario puede editar
const canEdit = computed(() => {
    // Comprobar si el usuario tiene la acción "update" y la condición necesaria
    const updatePermission = props.userPermissions.find(permission => permission.name === 'update');

    if (!updatePermission) return false; // Si no tiene permiso de actualización, no puede editar

    // Verificar la condición para el permiso
    const condition = updatePermission.condition;
    if (condition.name === 'all') {
        return true; // Puede editar cualquier recurso
    }

    if (condition.name === 'owner_only') {
        // Comprueba si el usuario es el propietario
        return userIsOwner(); // Implementar esta función según la lógica de tu app
    }

    return false; // Por defecto, no puede editar
});

// Función para verificar si el usuario puede eliminar
const canDelete = computed(() => {
    // Lógica similar a canEdit, puedes definir otro conjunto de permisos
    const deletePermission = props.userPermissions.find(permission => permission.name === 'delete');

    if (!deletePermission) return false; // Si no tiene permiso de eliminación, no puede eliminar

    const condition = deletePermission.condition;
    if (condition.name === 'all') {
        return true; // Puede eliminar cualquier recurso
    }

    if (condition.name === 'owner_only') {
        return userIsOwner(); // Implementar esta función según la lógica de tu app
    }

    return false; // Por defecto, no puede eliminar
});
// Función para verificar si el usuario puede eliminar
const canView = computed(() => {
    // Lógica similar a canEdit, puedes definir otro conjunto de permisos
    const viewPermission = props.userPermissions.find(permission => permission.name === 'view');

    if (!viewPermission) return false; // Si no tiene permiso de eliminación, no puede eliminar

    const condition = viewPermission.condition;
    if (condition.name === 'all') {
        return true; // Puede eliminar cualquier recurso
    }

    if (condition.name === 'owner_only') {
        return userIsOwner(); // Implementar esta función según la lógica de tu app
    }

    return false; // Por defecto, no puede eliminar
});
// Implementa esta función según la lógica de tu aplicación
function userIsOwner() {
    // Lógica para determinar si el usuario actual es el propietario del recurso
    // Por ejemplo, comparar IDs de usuario o cualquier otro método necesario
    return props.user.user_id === authStore.user?.user_id || props.user.owner_id === authStore.user?.user_id // Ajusta esto según tu lógica
}
</script>
