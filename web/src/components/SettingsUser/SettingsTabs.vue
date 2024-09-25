<template>
    <q-tabs v-model="activeTab" class="q-mt-md">
        <q-tab name="general" :label="$t('settings.tabs.general')" />
        <q-tab name="security" :label="$t('settings.tabs.security')" />
        <q-tab name="theme" :label="$t('settings.tabs.theme')" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" indicator-color="transparent" active-color="white">
        <q-tab-panel name="general">
            <UserInfoForm />
        </q-tab-panel>

        <q-tab-panel name="security">
            <SecurityForm />
        </q-tab-panel>

        <q-tab-panel name="theme">
            <ThemeToggle />
        </q-tab-panel>
    </q-tab-panels>
</template>

<script setup>
import { ref } from 'vue';
import UserInfoForm from './UserInfoForm.vue';
import SecurityForm from './SecurityForm.vue';
import ThemeToggle from './ThemeToggle.vue';

const activeTab = ref('general');
</script>
