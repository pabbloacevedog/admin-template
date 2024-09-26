<template>

    <div class="row justify-center items-center column q-pb-sm">
        <q-avatar size="60px">
            <img :src="authStore.user?.avatar">
        </q-avatar>
        <div class="text-h6 text-center q-mt-sm q-mb-xs text-theme">{{ authStore.user?.name }}</div>
        <q-item-label caption style="font-size: 11px;" class="text-theme q-mb-sm ">
            {{ authStore.user?.email }}
        </q-item-label>
        <q-chip dense color="teal" text-color="white" icon="attribution">
            Administrator
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
