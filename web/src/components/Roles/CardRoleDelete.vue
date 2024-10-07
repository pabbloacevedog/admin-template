<template>

    <div class="row justify-center items-center column q-pb-sm">
        <q-avatar size="60px">
            <img :src="role?.avatar">
        </q-avatar>
        <div class="text-h6 text-center q-mt-sm q-mb-xs text-theme ellipsis">{{ role?.name }}</div>
        <q-item-label caption style="font-size: 11px;" class="text-theme q-mb-sm ellipsis">
            {{ role?.email }}
        </q-item-label>
        <q-chip dense :color="role?.role?.color" text-color="white" icon="attribution" style="font-size: 12px; padding: 10px 8px 10px 7px">
            {{ role?.role?.title }}
        </q-chip>
    </div>
</template>

<script setup>
const props = defineProps({
    role: {
        type: Object,
        required: true,
    },
});

</script>
<script>
export default {
    name: 'CardRoleDelete',
}
</script>
