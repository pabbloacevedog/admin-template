<template>
    <div v-if="$q.screen.lt.md">
        <!-- Mobile layout -->
        <div v-if="!showTabPanel" class="full-height bg-first">
            <CardUserBig />
            <!-- Show tabs in fullscreen -->
            <q-tabs v-model="activeTab" vertical indicator-color="transparent" inline-label class="q-pt-xl full-height">
                <q-tab name="general" class="tab-settings" @click="showTabPanel = true">
                    <ItemSettingsTabs :title="$t('account.tabs.general.personal.subtitle')"
                        :description="$t('account.tabs.general.personal.description')" :icon="'account_circle'" />
                </q-tab>
                <q-separator class="q-my-md" />
                <q-tab name="security" class="tab-settings" @click="showTabPanel = true">
                    <ItemSettingsTabs :title="$t('account.tabs.security.title')"
                        :description="$t('account.tabs.security.description')" :icon="'fingerprint'" />
                </q-tab>
                <q-separator class="q-my-md" />
                <q-tab name="theme" class="tab-settings" @click="showTabPanel = true">
                    <ItemSettingsTabs :title="$t('account.tabs.theme.title')"
                        :description="$t('account.tabs.theme.description')" :icon="'dark_mode'" />
                </q-tab>
            </q-tabs>
        </div>

        <div v-else class="full-height bg-first">
            <!-- Show tab panel in fullscreen with a back button -->
            <q-btn icon="arrow_back" color="primary" rounded @click="showTabPanel = false" class="q-mb-md" label="Back"
                size="sm" outline />

            <q-tab-panels v-model="activeTab" animated swipeable vertical transition-prev="jump-up"
                transition-next="jump-up" class="bg-first col-xs-12">
                <q-tab-panel name="general" class="q-pa-none fit">
                    <div class="q-py-lg q-px-md bg-second div-rounded-radius h-form">
                        <UserInfoForm />
                    </div>
                </q-tab-panel>

                <q-tab-panel name="security" class="q-pa-none fit">
                    <div class="q-py-lg q-px-md bg-second div-rounded-radius h-form">
                        <SecurityForm />
                    </div>
                </q-tab-panel>

                <q-tab-panel name="theme" class="q-pa-none fit">
                    <div class="q-py-lg q-px-md bg-second div-rounded-radius h-form">
                        <ThemeToggle />
                    </div>
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </div>

    <q-splitter v-else v-model="splitterModel" class="bg-first col-xs-12">
        <!-- Desktop layout -->
        <template v-slot:before>
            <CardUserBig />
            <q-tabs v-model="activeTab" vertical indicator-color="transparent" inline-label class="q-pt-xl ">
                <q-tab name="general" class="tab-settings">
                    <ItemSettingsTabs :title="$t('account.tabs.general.personal.subtitle')"
                        :description="$t('account.tabs.general.personal.description')" :icon="'account_circle'" />
                </q-tab>
                <q-separator class="q-my-md" />
                <q-tab name="security" class="tab-settings">
                    <ItemSettingsTabs :title="$t('account.tabs.security.title')"
                        :description="$t('account.tabs.security.description')" :icon="'fingerprint'" />
                </q-tab>
                <q-separator class="q-my-md" />
                <q-tab name="theme" class="tab-settings">
                    <ItemSettingsTabs :title="$t('account.tabs.theme.title')"
                        :description="$t('account.tabs.theme.description')" :icon="'dark_mode'" />
                </q-tab>
            </q-tabs>
        </template>

        <template v-slot:after>
            <q-tab-panels v-model="activeTab" animated swipeable vertical transition-prev="jump-up"
                transition-next="jump-up" class="q-pl-lg fit bg-first col-xs-12">
                <q-tab-panel name="general" class="q-pa-none fit">
                    <div class="q-py-lg q-px-xl bg-second div-rounded-radius h-form">
                        <UserInfoForm />
                    </div>
                </q-tab-panel>

                <q-tab-panel name="security" class="q-pa-none fit">
                    <div class="q-py-lg q-px-xl bg-second div-rounded-radius h-form">
                        <SecurityForm />
                    </div>
                </q-tab-panel>

                <q-tab-panel name="theme" class="q-pa-none fit">
                    <div class="q-py-lg q-px-xl bg-second div-rounded-radius h-form">
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
const splitterModel = ref(25);
const showTabPanel = ref(false);
</script>
<script>
export default {
    name: 'AccountTabs',
}
</script>
<style scoped>
.tab-settings {
    text-align: left !important;
    justify-content: start !important;
    padding: 0px 0px !important;
}

.h-form {
    min-height: 80vh !important;
}

.full-height {
    height: 100vh;
}

@media (max-width: 768px) {
    .h-form {
        min-height: 75vh !important;
    }
}
</style>
