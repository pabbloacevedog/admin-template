<template>

    <q-item class="q-pl-none q-pr-xs item-input-roles">
        <q-item-section class="q-pa-none">
            <q-item-label class="input-title-panel-roles">{{ title }}</q-item-label>
            <q-item-label caption style="font-size: 10px;" class="input-description-panel-roles ellipsis" no-caps>
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
.input-title-panel-roles {
    font-size: 16px !important;
    font-weight: bold;
    text-transform: none;
}

.input-description-panel-roles {
    font-size: 12px !important;
    text-transform: none;
}

.item-input-roles .q-item__section {
    justify-content: start;
}
.item-input-roles {
        height: 76px;
    }
@media (max-width: 768px) {
    .input-title-panel-roles {
        font-size: 13px !important;
        font-weight: bold;
        text-transform: none;
    }

    .item-input-roles {
        height: 60px;
        padding-top: 0px;
    }
}
</style>
