<template>

    <q-item class="q-pl-md q-py-xs item-panel-settings" v-ripple>
        <q-item-section avatar top>
            <q-avatar color="first">
                <q-icon :name="icon" color="second" style="font-size: 40px;width: 40px;height: 40px;" class="p-qa-none" />
            </q-avatar>
        </q-item-section>
        <q-item-section class="q-pa-none">
            <q-item-label class="subtitle-panel-settings">{{ subtitle}}</q-item-label>
            <q-item-label caption  class="description-panel-settings" no-caps>
                {{ description}}
            </q-item-label>
        </q-item-section>
    </q-item>

</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
    subtitle: String,
    description: String,
    icon: String,
});
</script>
<script>
export default {
    name: 'SubTitleSettingsPanel',
}
</script>
<style lang="css">
.subtitle-panel-settings{
    font-size: 14px !important;
    font-weight: bold;
    text-transform: none;
}
.item-panel-settings{
    width: 100% !important;
}
.description-panel-settings{
    font-size: 12px !important;
    text-transform: none;
}
</style>
