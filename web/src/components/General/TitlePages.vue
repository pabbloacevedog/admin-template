<template>
    <div class="row q-my-none justify-between items-center">
        <div class="col-12 q-pl-xs bg-second div-rounded-radius">
            <q-item class="q-pl-md q-py-md item-panel-settings">
                <q-item-section avatar top>
                    <q-avatar color="first" :icon="icon" />
                </q-item-section>
                <q-item-section class="q-pa-none">
                    <q-item-label class="title-panel-settings">{{ title }}</q-item-label>
                    <q-item-label caption  class="description-panel-settings ellipsis" no-caps>
                {{ description}}
            </q-item-label>
                </q-item-section>
                <div class="flex justify-end" v-if="btn_create">
                    <q-btn :label="label_btn" :icon="icon_btn" color="primary" class="btn-border-radius" @click="btn_create" />
                </div>
            </q-item>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
    title: String,
    description: String,
    icon: String,
    label_btn: String,
    icon_btn: String,
    btn_create: {
        type: Function,
        default: null, // Si no se pasa la función, será null
    },
});
</script>

<style lang="css">
.title-panel-settings {
    font-size: 18px !important;
    font-weight: bold;
    text-transform: none;
}

.item-panel-settings {
    width: 100% !important;
}
</style>
