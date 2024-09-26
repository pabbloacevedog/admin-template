<template>
    <q-page class="q-px-xl q-py-xs">
        <div class="row q-my-none justify-between items-center">
            <div class="col-12 q-pl-xs bg-second div-rounded-radius">
                <TitleSettingsPanel :title="$t('settings.tabs.general.title')"
                :description="$t('settings.tabs.general.description')" :icon="'manage_accounts'" />
            </div>
        </div>
        <div class="col-12 q-pt-md" style="position: relative;">
            <q-card class="col-12 w-100 div-rounded-radius" flat>
                <SettingsTabs />
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import SettingsTabs from 'components/SettingsUser/SettingsTabs.vue';
import TitleSettingsPanel from 'components/SettingsUser/TitleSettingsPanel.vue';
</script>
