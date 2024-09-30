<template>

    <q-item class="q-pl-none q-pr-xs item-input-settings" style="height: 76px;">
        <q-item-section class="q-pa-none">
            <q-item-label class="input-title-panel-settings">{{ title }}</q-item-label>
            <q-item-label caption style="font-size: 10px;" class="input-description-panel-settings" no-caps>
                {{ description }}
            </q-item-label>
        </q-item-section>
    </q-item>

</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
    title: String,
    description: String,
});
</script>

<style lang="css">
.input-title-panel-settings {
    font-size: 16px !important;
    font-weight: bold;
    text-transform: none;
}

.input-description-panel-settings {
    font-size: 12px !important;
    text-transform: none;
}

.item-input-settings .q-item__section {
    justify-content: start;
}

@media (max-width: 768px) {
    .input-title-panel-settings {
        font-size: 13px !important;
        font-weight: bold;
        text-transform: none;
    }
}
</style>
