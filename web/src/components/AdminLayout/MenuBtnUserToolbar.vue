<template>
    <q-menu auto-close class="btn-toolbar shadow-menu-user div-blur q-px-lg menu-user-top" transition-show="jump-down" transition-hide="jump-up">
        <q-list>
            <div class="q-py-md">
                <CardUser />
                <q-separator class="q-my-xs" />
                <q-item clickable @click="goUserSettings" class="item-menu-user">
                    <q-item-section avatar class="icon-section-menu-user">
                        <q-icon name="settings" size="20px" />
                    </q-item-section>
                    <q-item-section class="text-section-menu-user">
                        Account settings
                    </q-item-section>
                </q-item>
                <q-item clickable @click="goUserMessages" class="item-menu-user">
                    <q-item-section avatar class="icon-section-menu-user">
                        <q-icon name="mail_outline" size="20px" />
                    </q-item-section>
                    <q-item-section class="text-section-menu-user">
                        Messages
                    </q-item-section>
                </q-item>
                <q-separator class="q-my-xs" />
                <q-item clickable class="item-menu-user" @click="logOut">
                    <q-item-section avatar class="icon-section-menu-user">
                        <q-icon name="logout" size="20px" />
                    </q-item-section>
                    <q-item-section class="text-section-menu-user">Log out</q-item-section>
                </q-item>
            </div>
        </q-list>
    </q-menu>
</template>

<script setup>
import CardUser from '../General/CardUser.vue';
const props = defineProps({
    goUserSettings: Function,
    goUserMessages: Function,
    logOut: Function
});
</script>
<style>
</style>
