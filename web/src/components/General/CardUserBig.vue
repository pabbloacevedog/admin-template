<template>

    <div class="row justify-center items-center column q-py-lg bg-second div-rounded-radius">
        <q-avatar size="120px">
            <img :src="authStore.user?.avatar">
        </q-avatar>
        <div class="text-h5 text-center q-mt-lg q-mb-sm text-theme ellipsis">{{ authStore.user?.name }}</div>
        <q-item-label caption style="font-size: 14px;" class="text-theme q-mb-md ellipsis">
            {{ authStore.user?.email }}
        </q-item-label>
        <q-chip  :color="authStore.user?.role?.color" text-color="white" icon="attribution" style="padding: 10px 8px 10px 7px">
            {{ authStore.user?.role?.title }}
        </q-chip>
    </div>
</template>

<script setup>
import { useAuthStore } from 'stores/auth';
const authStore = useAuthStore();
const props = defineProps({
    goUserSettings: Function,
    goUserMessages: Function,
    logOut: Function
});
</script>
