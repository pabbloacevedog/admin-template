<template>
    <q-card class="bg-card bg-second" flat style="padding: 7% !important;">
        <q-card-header>
            <q-toolbar class="div-rounded-radius q-py-xs" :class="getCardClass(role)">
                <q-toolbar-title>
                    <q-item-label class="text-weight-bold text-center">{{ role.title }}</q-item-label>
                </q-toolbar-title>
            </q-toolbar>
        </q-card-header>
        <q-list dense>
            <!-- Filtramos las columnas para no mostrar 'title', 'color' y 'acciones' -->
            <q-item v-for="col in role.columns" :key="col.name" :props="role.props" class="q-pa-none">
                <q-item-section>
                    <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-item-label caption>{{ col.value }}</q-item-label>
                </q-item-section>
            </q-item>

            <!-- Mostrar la descripción en un q-item separado -->
            <q-item v-if="role.description">
                <q-item-section>
                    <q-item-label>{{ role.description }}</q-item-label>
                </q-item-section>
            </q-item>
            <q-item>
                <q-toolbar class="bg-second">
                    <q-toolbar-title>
                        <q-item-label class="text-center">
                            <ItemActionsTable :resource="role" :edit="editRole"
                                :showDeleteModal="showDeleteRoleModal"
                                :showViewModal="showViewRoleModal"
                                :permissions="availableActions"
                                :color="getColorClass(role)" />
                        </q-item-label>
                    </q-toolbar-title>
                </q-toolbar>
            </q-item>
        </q-list>
    </q-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from 'stores/auth';
import { useRoleStore } from 'stores/role';
import ItemActionsTable from 'components/General/ItemActionsTable.vue';
const authStore = useAuthStore();
const roleStore = useRoleStore();
const props = defineProps({
    role: {
        type: Object,
        required: true,
    },
});
const getCardClass = (row) => {
    console.log('row', row)
    // Asegúrate de que el color en la fila es válido y retorna la clase adecuada
    return row.color ? `text-${row.color}` : 'primary'; // Si no hay color, usa 'bg-primary' como clase por defecto
};
const getColorClass = (row) => {
    console.log('row', row)
    // Asegúrate de que el color en la fila es válido y retorna la clase adecuada
    return row.color ? `text-${row.color}` : 'primary'; // Si no hay color, usa 'bg-primary' como clase por defecto
};
const pagesNumber = computed(() => Math.ceil(totalRoles.value / pagination.value.rowsPerPage));
// Computed para obtener las acciones de la ruta
const availableActions = computed(() => {
    const route = routes.value.find(route => route.name === routeName);
    return route ? route.action : [];
});
</script>
<script>
export default {
    name: 'CardRole',
}
</script>
