<template>
    <q-splitter v-model="splitterModel">
        <template v-slot:before>
            <CardUserBig />
            <q-tabs v-model="activeTab" vertical indicator-color="transparent" inline-label class="q-pt-xl">
                <q-tab name="general" class="tab-settings">
                    <ItemSettingsTabs :title="$t('settings.tabs.general.personal.subtitle')"
                        :description="$t('settings.tabs.general.personal.description')" :icon="'account_circle'" />
                </q-tab>
                <q-separator class="q-my-md" />
                <q-tab name="security" class="tab-settings">
                    <ItemSettingsTabs :title="$t('settings.tabs.security.title')"
                        :description="$t('settings.tabs.security.description')" :icon="'fingerprint'" />
                </q-tab>
                <q-separator class="q-my-md" />
                <q-tab name="theme" class="tab-settings">
                    <ItemSettingsTabs :title="$t('settings.tabs.theme.title')"
                        :description="$t('settings.tabs.theme.description')" :icon="'dark_mode'" />
                </q-tab>
            </q-tabs>
        </template>

        <template v-slot:after>
            <q-tab-panels v-model="activeTab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up" class="q-pl-lg fit">
                <q-tab-panel name="general" class="q-pa-none fit">
                    <div class="q-py-lg q-px-xl bg-second div-rounded-radius fit">
                        <UserInfoForm />
                    </div>
                </q-tab-panel>

                <q-tab-panel name="security" class="q-pa-none fit">
                    <div class="q-py-lg q-px-xl bg-second div-rounded-radius fit">
                        <SecurityForm />
                    </div>
                </q-tab-panel>

                <q-tab-panel name="theme" class="q-pa-none fit">
                    <div class="q-py-lg q-px-xl bg-second div-rounded-radius fit">
                        <ThemeToggle />
                    </div>

                </q-tab-panel>
            </q-tab-panels>
        </template>
    </q-splitter>
</template>

<script setup>
import { ref } from 'vue';
import UserInfoForm from './UserInfoForm.vue';
import SecurityForm from './SecurityForm.vue';
import ThemeToggle from './ThemeToggle.vue';
import CardUserBig from '../General/CardUserBig.vue';
import ItemSettingsTabs from './ItemSettingsTabs.vue';
const activeTab = ref('general');
const splitterModel = ref(20);
</script>

<style scoped>
.tab-settings {
    /* min-height: 10vh !important; */
    text-align: left !important;
    justify-content: start !important;
    padding: 0px 0px !important;
}
</style>