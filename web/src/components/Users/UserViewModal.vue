<template>
    <q-dialog v-model="isOpen" persistent class="container-modal" transition-show="none" transition-hide="none" backdrop-filter="blur(4px) saturate(150%)">
        <div class="form-modal-view div-blur div-rounded-radius" :style="dialogStyle">
            <q-card flat style="flex-grow: 1; display: flex; flex-direction: column; background: #00000000 !important;">
                <q-card-section>
                    <div class="row justify-center items-center column">
                        <q-avatar size="200px">
                            <img :src="user?.avatar">
                        </q-avatar>
                        <div class="text-center q-mt-md q-mb-md text-theme text-message-delete">
                            <strong>{{ user.name }}</strong>
                        </div>

                        <q-item-label caption style="font-size: 16px;" class="text-theme q-mb-md ellipsis">
                            {{ user?.email }}
                        </q-item-label>
                        <q-chip :color="user?.role?.color" text-color="white" icon="attribution">
                            {{ user?.role?.title }}
                        </q-chip>
                    </div>
                </q-card-section>
                <q-card-section horizontal class="q-pt-none row justify-center">
                    <q-card-section class="col-7 q-pl-none q-pr-xs">
                        <InputTitleModalView v-if="user?.username" :title="$t('users.account.username.title')"
                            :description="$t('users.account.username.description')" />
                        <InputTitleModalView v-if="user?.personal_phone" :title="$t('users.account.personal_phone.title')"
                            :description="$t('users.account.personal_phone.description')" />
                        <InputTitleModalView :title="$t('users.account.verified.title')"
                            :description="$t('users.account.verified.description')" />
                        <InputTitleModalView :title="$t('users.account.state.title')"
                            :description="$t('users.account.state.description')" />
                    </q-card-section>

                    <q-card-section class="col-5 q-pr-none q-pl-xs">
                        <div class="btn-verified-view input-bottom-view " v-if="user?.username">
                            <q-item class="q-pa-none">
                                <q-item-section avatar class="q-pa-none q-pl-sm">
                                    <q-item-label class="text-weight-bold label-user-view">@{{ user?.username
                                        }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </div>
                        <div class="btn-verified-view input-bottom-view" v-if="user?.personal_phone">
                            <q-item class="q-pa-none">
                                <q-item-section avatar class="q-pa-none q-pl-sm">
                                    <q-item-label class="text-weight-bold label-user-view">{{
                                        user?.personal_phone }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </div>
                        <div class="btn-verified-view input-bottom-view">
                            <q-item class="q-pa-none justify-start" v-if="user?.verified">
                                <q-item-section avatar class="q-ma-none q-pa-none">
                                    <q-chip icon-right="verified" class="chip-verified-view">
                                        {{
                                            $t('users.account.verified.title')
                                        }}
                                    </q-chip>
                                </q-item-section>
                            </q-item>
                            <q-item class="q-pa-none row justify-start" v-else>
                                <q-item-section avatar class="q-ma-none q-pa-none">
                                    <q-chip icon-right="verified" class="chip-noverified-view">No
                                        {{
                                            $t('users.account.verified.title')
                                        }}
                                    </q-chip>
                                </q-item-section>
                            </q-item>
                        </div>

                        <div class="btn-verified-view input-bottom-view">
                            <q-item class="q-pa-none">
                                <q-item-section avatar class="q-pa-none q-pl-sm">
                                    <q-chip square outline :color="user?.state ? 'positive' : 'negative'"
                                        text-color="white" :label="user?.state ? 'Active' : 'Inactive'"
                                        class="chip-status-view" icon-right="fiber_manual_record" />
                                </q-item-section>
                            </q-item>

                        </div>
                    </q-card-section>

                </q-card-section>
            </q-card>
            <!-- Botones en posición fija usando q-page-sticky -->
            <!-- <q-page-sticky position="bottom" :offset="[0, 50]" class="q-mb-md" v-if="isMobile"> -->
                <div class="flex justify-center q-pt-lg" v-if="isMobile">
                    <q-btn :label="$t('users.view.btn_action')" color="primary" class="btn-border-radius"
                        @click="close" />
                </div>
            <!-- </q-page-sticky> -->
            <div class="flex justify-center q-pb-lg" v-else>
                <q-btn :label="$t('users.view.btn_action')" color="primary" class="btn-border-radius q-px-lg"
                    @click="close" />
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from 'stores/user';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import InputTitleModalView from './InputTitleModalView.vue';
const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});

const emits = defineEmits(['close']);

const $q = useQuasar();
const { t } = useI18n();
const isOpen = ref(true);
const userStore = useUserStore();

const close = () => {
    isOpen.value = false;
    emits('close');
};
// Detectar si es móvil
const isMobile = computed(() => {
    return window.innerWidth <= 600; // Define tu umbral para mobile aquí
});

// Estilo de dialog
const dialogStyle = computed(() => {
    return isMobile.value ? 'width: 100vw; max-width: 100vw; max-height: 100vh !important;height: 98vh;margin: 8px;' : 'width: 600px; max-width: 100vw;';
});


</script>

<style scoped>
@media (max-width: 855px) {
    .text-message-delete {
        font-size: 28px;
        font-weight: 300;
    }
    .btn-verified-view {
        height: 60px !important;
        width: 100%;
    }
    .label-user-view{
        font-size: 14px;;
    }
}

.chip-status-view {
    font-size: 16px;
    padding: 9px 10px;
}

.chip-verified-view {
    font-size: 18px;
    padding: 9px 10px;
    background: #ffffff00 !important;
}

.chip-noverified-view {
    font-size: 18px;
    padding: 9px 10px;
    background: #ffffff00 !important;
}

/* Estilo para pantallas pequeñas: ratio libre */
@media (min-width: 855px) {

    .text-message-delete {
        font-size: 24px;
        font-weight: 300;
        max-width: 80%;

    }
    .label-user-view{
        font-size: 18px;;
    }
    .btn-verified-view {
        height: 62px !important;
        width: 100%;
    }
}

.input-form {
    padding: 0px 0px 4px 0px;
}

.input-bottom-view {
    padding: 0px 0px 10px 0px;
}
</style>
