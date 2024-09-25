<template>
    <q-btn rounded flat no-caps size="md" class="btn-user btn-toolbar">
        <ItemBtnUserToolbar />
        <MenuBtnUserToolbar :goUserSettings="goUserSettings" :goUserMessages="goUserMessages" :logOut="logOut" />
    </q-btn>
</template>

<script setup>
import { ref } from 'vue';
import MenuBtnUserToolbar from './MenuBtnUserToolbar.vue';
import ItemBtnUserToolbar from './ItemBtnUserToolbar.vue';
const props = defineProps({
    goUserSettings: Function,
    goUserMessages: Function,
    logOut: Function
});
</script>
