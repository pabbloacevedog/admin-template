<template>

    <q-item class="q-pl-md q-py-sm item-panel-settings" v-ripple>
        <q-item-section avatar top>
            <q-avatar color="first" :icon="icon" />
        </q-item-section>
        <q-item-section class="q-pa-none">
            <q-item-label class="title-panel-settings">{{ title}}</q-item-label>
        </q-item-section>
    </q-item>

</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
    title: String,
    description: String,
    icon: String,
});
</script>

<style lang="css">
.title-panel-settings{
    font-size: 18px !important;
    font-weight: bold;
    text-transform: none;
}
.item-panel-settings{
    width: 100% !important;
}
</style>
