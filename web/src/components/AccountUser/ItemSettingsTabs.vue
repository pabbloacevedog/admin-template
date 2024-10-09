<template>

    <q-item class="q-pl-lg q-py-md item-section-menu-settings" v-ripple>
        <q-item-section avatar top>
            <q-avatar color="primary" text-color="white" :icon="icon" />
        </q-item-section>
        <q-item-section class="q-pa-none">
            <q-item-label class="title-section-menu-settings ellipsis">{{ title}}</q-item-label>
            <q-item-label caption style="font-size: 10px;" class="description-section-menu-settings ellipsis" no-caps>
                {{ description}}
            </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="arrow_forward_ios" color="white" />
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
<script>
export default {
    name: 'ItemSettingsTabs',
}
</script>
<style lang="css">
.title-section-menu-settings{
    font-size: 16px !important;
    font-weight: bold;
    text-transform: none;
}
.description-section-menu-settings{
    font-size: 13px !important;
    text-transform: none;
}
.item-section-menu-settings{
    width: 100% !important;
}
</style>
