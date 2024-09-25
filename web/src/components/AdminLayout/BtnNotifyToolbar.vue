<template>
    <q-btn flat round size="md" icon="notifications" class="q-mr-md btn-toolbar text-theme">
        <q-badge color="red" floating>4</q-badge>
        <MenuBtnNotifyToolbar />
    </q-btn>
</template>

<script setup>
import MenuBtnNotifyToolbar from './MenuBtnNotifyToolbar.vue';
</script>
