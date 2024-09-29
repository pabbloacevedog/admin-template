<template>
    <q-page class="q-px-lg q-py-xs">
        <TitlePages :title="$t('settings.tabs.title')"
            :description="$t('settings.tabs.description')" :icon="$t('settings.tabs.icon')"  />
        <div class="col-12 q-pt-md" style="position: relative;">
            <q-card class="col-12 w-100 div-rounded-radius" flat>
                <!-- aqui va el contenido de la pages -->
                <SettingsTabs />
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import SettingsTabs from 'components/SettingsUser/SettingsTabs.vue';
import TitlePages from 'components/General/TitlePages.vue';
</script>
