<template>
    <q-dialog v-model="isOpen" persistent backdrop-filter="blur(4px) saturate(150%)" class="container-modal"
        :fullscreen="isMobile" transition-show="none" transition-hide="none">
        <div class="q-py-lg form-modal-view div-blur div-rounded-radius h-form" :style="dialogStyle">
            <q-card flat style="flex-grow: 1; display: flex; flex-direction: column;background: #00000000 !important;">
                <q-card-header>
                    <q-toolbar class="div-rounded-radius q-py-xs">
                        <q-toolbar-title>
                            <SubTitleSettingsPanel :subtitle="$t('roles.delete.title')"
                                :description="$t('roles.delete.description')" :icon="'person_remove'" />
                        </q-toolbar-title>
                        <q-btn round flat icon="close" @click="close" />
                    </q-toolbar>
                </q-card-header>
                <q-card-section v-if="role?.totalUsers < 1">
                    <div class="row justify-center items-center column q-py-md">

                        <div class="text-center q-mt-md q-mb-md text-theme text-message-delete">
                            {{ $t('roles.delete.message') }} <q-chip :color="role?.color" text-color="white"
                                icon="attribution">{{ role?.title }}</q-chip> ?
                        </div>
                        <!-- Aquí agregamos los avatares de los usuarios -->
                        <q-item v-if="role?.avatars && role?.avatars.length" class="q-my-sm"
                            style="padding: 2px 2px;">
                            <q-item-section>
                                <q-item-label class="text-h7">
                                    <div class="flex justify-start" v-if="role?.totalUsers">
                                        <div v-if="role?.totalUsers > 1" class="text-h7">
                                            +{{ role?.totalUsers }} role users
                                        </div>
                                        <div v-else class="text-h7">
                                            +{{ role?.totalUsers }} role user
                                        </div>
                                    </div>
                                    <div class="flex justify-start text-h6" v-else>
                                        0 Users
                                    </div>
                                </q-item-label>

                            </q-item-section>
                            <div class="flex justify-end">
                                <q-avatar v-for="(rs, n) in role?.avatars" :key="n" size="30px" class="overlapping"
                                    @click="selectRememberedUsers()" :style="`right: ${n * 15}px`">
                                    <img :src="rs">
                                </q-avatar>
                            </div>
                        </q-item>
                        <q-item-label caption style="font-size: 16px;" class="text-theme q-mb-md">
                            {{ role?.description }}
                        </q-item-label>
                    </div>
                </q-card-section>
                <q-card-section v-else>
                    <div class="row justify-center items-center column q-py-md">

                        <div class="text-center q-mt-md q-mb-md text-theme text-message-delete">
                            {{ $t('roles.delete.message_no_delete_1') }} <q-chip :color="role?.color" text-color="white"
                                icon="attribution">{{ role?.title }}</q-chip>
                            {{ $t('roles.delete.message_no_delete_2') }}
                        </div>

                        <q-item-label caption style="font-size: 16px;" class="text-theme q-mb-md">
                            {{ role?.description }}
                        </q-item-label>
                    </div>
                </q-card-section>
            </q-card>
            <!-- Botones en posición fija usando q-page-sticky -->
            <!-- <q-page-sticky position="bottom" :offset="[0, 36]" class="q-mb-md" v-if="isMobile"> -->
            <div class="flex justify-center q-pt-lg" v-if="isMobile">
                <q-btn :label="$t('roles.delete.btn_cancel')" outline color="primary" class="btn-border-radius q-mr-lg"
                    @click="close" />
                <q-btn :label="$t('roles.delete.btn_action')" color="negative" class="btn-border-radius"
                    @click="deleteRole" v-if="role?.totalUsers < 1" />
            </div>
            <!-- </q-page-sticky> -->
            <div class="flex justify-center q-pb-lg" v-else>
                <q-btn :label="$t('roles.delete.btn_cancel')" outline color="primary" class="btn-border-radius q-mr-lg"
                    @click="close" />
                <q-btn :label="$t('roles.delete.btn_action')" color="negative" class="btn-border-radius"
                    @click="deleteRole" v-if="role?.totalUsers < 1" />
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoleStore } from 'stores/role';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import SubTitleSettingsPanel from 'components/SettingsUser/SubTitleSettingsPanel.vue';
const props = defineProps({
    role: {
        type: Object,
        required: true,
    },
});

const emits = defineEmits(['close']);

const $q = useQuasar();
const { t } = useI18n();
const isOpen = ref(true);
const roleStore = useRoleStore();

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

const deleteRole = async () => {
    try {
        await roleStore.deleteRole(props.role.role_id);
        $q.notify({
            type: 'positive',
            message: t('roles.messages.deleted_success'),
        });
    } catch (error) {
        $q.notify({
            type: 'negative',
            message: t('roles.messages.deleted_error'),
        });
        console.error('Error deleting role:', error);
    }
    close();
};
</script>
<script>
export default {
    name: 'RoleDeleteModal',
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
