<template>

    <q-item class="q-pl-none q-pr-xs item-input-users">
        <q-item-section class="q-pa-none">
            <q-item-label class="input-title-panel-users">{{ title }}</q-item-label>
            <q-item-label caption style="font-size: 10px;" class="input-description-panel-users ellipsis" no-caps>
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
.input-title-panel-users {
    font-size: 16px !important;
    font-weight: bold;
    text-transform: none;
}

.input-description-panel-users {
    font-size: 12px !important;
    text-transform: none;
}

.item-input-users .q-item__section {
    justify-content: start;
}
.item-input-users {
        height: 76px;
    }
@media (max-width: 768px) {
    .input-title-panel-users {
        font-size: 13px !important;
        font-weight: bold;
        text-transform: none;
    }

    .item-input-users {
        height: 60px;
        padding-top: 0px;
    }
}
</style>
