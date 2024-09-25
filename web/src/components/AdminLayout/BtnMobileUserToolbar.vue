<template>
    <q-btn rounded flat no-caps size="md" class="btn-toolbar" style="padding: 0px 0px 0px 0px !important;">
        <q-avatar size="43px">
            <img :src="authStore.user?.avatar">
        </q-avatar>
        <MenuBtnUserToolbar :goUserSettings="goUserSettings" :goUserMessages="goUserMessages" :logOut="logOut" />
    </q-btn>
</template>

<script setup>
import { useAuthStore } from 'stores/auth';
const authStore = useAuthStore();
import MenuBtnUserToolbar from './MenuBtnUserToolbar.vue';
const props = defineProps({
    goUserSettings: Function,
    goUserMessages: Function,
    logOut: Function
});
</script>
