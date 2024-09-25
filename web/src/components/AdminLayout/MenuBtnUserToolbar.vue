<template>
    <q-menu auto-close class="btn-toolbar menu-user-top no-shadow" transition-show="jump-down" transition-hide="jump-up">
        <q-lis>
            <div class="q-pa-md">
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
        </q-lis>
    </q-menu>
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
