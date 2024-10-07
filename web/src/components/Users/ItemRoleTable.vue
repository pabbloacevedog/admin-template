<template>
    <q-chip :color="user?.role?.color" text-color="white" icon="attribution" class="q-pr-lg" style="font-size: 12px; padding: 7px 8px 7px 8px;">
        {{ user.role ? user.role.title : 'N/A' }}
    </q-chip>
</template>

<script setup>
const props = defineProps({
    user: {
        type: Object,
        default: () => ({}),
    },
});
</script>
<script>
export default {
    name: 'ItemRoleTable',
}
</script>
