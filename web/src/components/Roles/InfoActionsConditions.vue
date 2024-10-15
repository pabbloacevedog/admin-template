<template>
    <q-expansion-item v-model="expanded" dense class="bg-first div-rounded-radius q-pa-none q-ma-none" icon="info" label="Information" header-class="text-warning" >
        <q-card-section class="q-pt-none" style="padding: 0px 8px 8px 8px;">
            <q-tabs v-model="tab" dense class="text-grey tab-info" active-color="primary" indicator-color="transparent"
                align="justify">
                <q-tab name="action" label="Actions"></q-tab>
                <q-tab name="condition" label="Conditions"></q-tab>
            </q-tabs>

            <q-tab-panels v-model="tab" animated>
                <q-tab-panel name="action" class="q-pa-none">
                    <q-item-section v-for="action in actions" :key="action.action_id" style="margin: 0px !important; height: 40px;" dense>
                        <q-item class="q-pa-none row" style="margin: 0px !important; max-height: 40px;" dense>
                            <q-item-section avatar class="q-pr-none col-1" style="min-width: 40px;">
                                <q-avatar>
                                    <q-icon :name="action.icon" size="16px" />
                                </q-avatar>
                            </q-item-section>
                            <q-item-section class="col-2" style="min-width: 40px;">
                                <q-item-label style="font-size: 12px;">{{ action.title}}</q-item-label>
                            </q-item-section>
                            <q-item-section class="full-width" style="font-size: 11px; min-width: 40px;" >
                                {{ action.description }}
                            </q-item-section>
                        </q-item>
                    </q-item-section>
                </q-tab-panel>

                <q-tab-panel name="condition" class="q-pa-none">
                    <q-item-section v-for="condition in conditions" :key="condition.condition_id" style="margin: 0px !important; height: 40px;" dense>
                        <q-item class="q-pa-none row" style="margin: 0px !important; max-height: 40px;" dense>
                            <q-item-section class="col-3">
                                <q-item-label style="font-size: 12px;">{{ condition.title
                                    }}</q-item-label>
                            </q-item-section >
                            <q-item-section  class="full-width" style="font-size: 11px;">
                                {{ condition.description }}
                            </q-item-section>
                        </q-item>
                    </q-item-section>
                </q-tab-panel>
            </q-tab-panels>
        </q-card-section>
    </q-expansion-item>
</template>

<script setup>
import { ref } from 'vue';
const tab = ref('action');
const expanded = ref(false);
const props = defineProps({
    actions: {
        type: Object,
        default: () => ({}),
    },
    conditions: {
        type: Object,
        default: () => ({}),
    },
});
</script>
<script>
export default {
    name: 'InfoActionsConditions',
}
</script>
<style scoped></style>
