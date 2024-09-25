<template>
    <q-page class="q-px-lg q-py-sm">
        <div class="row q-my-sm justify-between items-center">
            <div class="col-6 col-md-6">
                <div class="text-h4">{{ $t('settings.title') }}</div>
            </div>
        </div>
        <div class="col-12" style="position: relative;">
            <q-card class="col-12 w-100 div-rounded-radius" flat>
                <HeaderSettingsUser />
                <SettingsTabs />
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import HeaderSettingsUser from 'components/SettingsUser/HeaderSettingsUser.vue';
import SettingsTabs from 'components/SettingsUser/SettingsTabs.vue';
</script>
