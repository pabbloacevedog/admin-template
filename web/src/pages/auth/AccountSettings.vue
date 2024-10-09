<template>
    <q-page class="page-padding q-py-xs">
        <TitlePages :title="$t('account.tabs.title')"
            :description="$t('account.tabs.description')" :icon="$t('account.tabs.icon')"  />
        <div class="col-12 q-pt-md" style="position: relative;">
            <q-card class="col-12 w-100 div-rounded-radius" flat>
                <!-- aqui va el contenido de la pages -->
                <AccountTabs />
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import AccountTabs from 'src/components/AccountUser/AccountTabs.vue';
import TitlePages from 'components/General/TitlePages.vue';
</script>
