<template>
    <q-dialog v-model="isOpen" persistent backdrop-filter="blur(4px) saturate(150%)" class="container-modal"
        :fullscreen="isMobile" transition-show="none" transition-hide="none">
        <div class="q-py-lg form-modal-view div-blur div-rounded-radius h-form" :style="dialogStyle">
            <q-card flat style="flex-grow: 1; display: flex; flex-direction: column;background: #00000000 !important;">
                <q-card-header>
                    <q-toolbar class="div-rounded-radius q-py-xs">
                        <q-toolbar-title>
                            <SubTitleSettingsPanel :subtitle="$t('users.delete.title')"
                                :description="$t('users.delete.description')" :icon="'person_remove'" />
                        </q-toolbar-title>
                        <q-btn round flat icon="close" @click="close" />
                    </q-toolbar>
                </q-card-header>
                <q-card-section>
                    <div class="row justify-center items-center column q-py-md">
                        <q-avatar size="150px">
                            <img :src="user?.avatar">
                        </q-avatar>
                        <div class="text-center q-mt-md q-mb-md text-theme text-message-delete">
                            {{ $t('users.delete.message') }} <strong>{{ user.name }}</strong> ?
                        </div>

                        <q-item-label caption style="font-size: 16px;" class="text-theme q-mb-md ellipsis">
                            {{ user?.email }}
                        </q-item-label>
                        <q-chip :color="user?.role?.color" text-color="white" icon="attribution">
                            {{ user?.role?.title }}
                        </q-chip>
                    </div>
                </q-card-section>

            </q-card>
            <!-- Botones en posición fija usando q-page-sticky -->
            <!-- <q-page-sticky position="bottom" :offset="[0, 36]" class="q-mb-md" v-if="isMobile"> -->
                <div class="flex justify-center q-pt-lg" v-if="isMobile">
                    <q-btn :label="$t('users.delete.btn_cancel')" outline color="primary" class="btn-border-radius q-mr-lg" @click="close" />
                    <q-btn :label="$t('users.delete.btn_action')"  color="negative" class="btn-border-radius" @click="deleteUser" />
                </div>
            <!-- </q-page-sticky> -->
            <div class="flex justify-center q-pb-lg" v-else>
                <q-btn :label="$t('users.delete.btn_cancel')" outline color="primary" class="btn-border-radius q-mr-lg" @click="close" />
                <q-btn :label="$t('users.delete.btn_action')" color="negative" class="btn-border-radius" @click="deleteUser" />
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from 'stores/user';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import SubTitleSettingsPanel from 'components/AccountUser/SubTitleSettingsPanel.vue';
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
    return isMobile.value ? 'width: 100vw; max-width: 100vw; max-height: 100vh !important;height: 98vh;margin: 8px;' : 'width: 800px; max-width: 100vw;';
});

const deleteUser = async () => {
    try {
        const response = await userStore.deleteUser(props.user.user_id);
        $q.notify({
            type: 'positive',
            message: response,
        });
    } catch (error) {
        console.error('Error deleting user:', error);
    }
    close();
};
</script>
<script>
export default {
    name: 'UserDeleteModal',
}
</script>
<style scoped>
@media (max-width: 855px) {

    .form-modal-delete {
        padding: 24px 24px;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .text-message-delete {
        font-size: 28px;
        font-weight: 300;
    }
}

/* Estilo para pantallas pequeñas: ratio libre */
@media (min-width: 855px) {

    .text-message-delete {
        font-size: 24px;
        font-weight: 300;
        max-width: 80%;
    }

    .form-modal-delete {
        padding: 16px 48px;
    }
}
</style>
