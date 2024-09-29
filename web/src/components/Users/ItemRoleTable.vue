<template>
    <q-chip color="primary" text-color="white" icon="attribution" class="q-pr-lg">
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
