<template>
    <q-item class="q-pa-none q-py-sm">
        <q-item-section avatar class="q-pa-none">
            <q-avatar>
                <img :src="user?.avatar">
            </q-avatar>
        </q-item-section>
        <q-item-section class="q-pa-none">
            <q-item-label class="text-weight-bold">{{ user?.name }}</q-item-label>
            <q-item-label caption style="font-size: 11px;" v-if="user?.username">
                                @{{ user?.username }}
                            </q-item-label>
        </q-item-section>
    </q-item>
</template>

<script setup>
const props = defineProps({
    user: {
        type: Object,
        default: () => ({}),
    },
});
</script>
