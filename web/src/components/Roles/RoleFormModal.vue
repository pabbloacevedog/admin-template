<template>
    <q-dialog v-model="roleStore.show_modal_role" @hide="resetForm" backdrop-filter="blur(4px) saturate(150%)"
        class="container-modal" :fullscreen="isMobile" transition-show="none" transition-hide="none">
        <div class="q-py-lg form-modal-view div-blur div-rounded-radius h-form" :style="dialogStyle">
            <q-card flat
                style="flex-grow: 1; display: flex; flex-direction: column;  background: #00000000 !important;">
                <q-card-header>
                    <q-toolbar class="div-rounded-radius">
                        <q-toolbar-title>
                            <SubTitleSettingsPanel
                                :subtitle="isEdit ? $t('roles.edit.title') : $t('roles.create.title')"
                                :description="isEdit ? $t('roles.edit.description') : $t('roles.create.description')"
                                :icon="isEdit ? 'supervisor_account' : 'person_add'" />
                        </q-toolbar-title>
                        <q-btn round flat icon="close" @click="close" />
                    </q-toolbar>
                </q-card-header>
                <q-card-section horizontal class="q-pt-none">
                    <q-card-section class="col-5 q-pl-none q-pr-xs">
                        <InputTitleModal :title="$t('roles.account.role_id.title')"
                            :description="$t('roles.account.role_id.description')" />
                        <InputTitleModal :title="$t('roles.account.name.title')"
                            :description="$t('roles.account.name.description')" class="q-mt-md q-mb-none" />
                        <InputTitleModal :title="$t('roles.account.title.title')"
                            :description="$t('roles.account.title.description')" />
                        <InputTitleModal :title="$t('roles.account.description.title')"
                            :description="$t('roles.account.description.description')" />
                        <InputTitleModal :title="$t('roles.account.color.title')"
                            :description="$t('roles.account.color.description')" />
                    </q-card-section>

                    <q-card-section class="col-7 q-pr-none q-pl-xs">
                        <q-input :dense="isMobile" class="q-mt-md q-mb-none" filled v-model="form.role_id"
                            :label="$t('roles.account.role_id.title')" type="text" readonly disabled />
                        <q-input :dense="isMobile" class="q-mt-md q-mb-none" filled v-model="form.name"
                            :label="$t('roles.account.name.title')" type="text" autocomplete="name" :error="errors.name"
                            :error-message="errors.nameMsg" />
                        <q-input :dense="isMobile" class="q-mt-md q-mb-none" filled v-model="form.title"
                            :label="$t('roles.account.title.title')" type="text" :error="errors.title"
                            :error-message="errors.titleMsg" />
                        <q-input :dense="isMobile" class="input-form" filled v-model="form.description"
                            :label="$t('roles.account.description.title')" type="text" />
                        <q-input :dense="isMobile" class="q-mb-none q-mt-md" filled v-model="form.color"
                            :label="$t('roles.account.color.title')" type="text"/>
                    </q-card-section>

                </q-card-section>
            </q-card>

            <!-- Botones en posición fija usando q-page-sticky -->
            <!-- <q-page-sticky position="bottom" :offset="[0, 36]" class="q-mb-md" v-if="isMobile"> -->
            <div class="flex justify-center q-pt-lg" v-if="isMobile">
                <q-btn :label="$t('roles.create.btn_cancel')" outline color="primary" class="btn-border-radius q-mr-lg"
                    @click="close" />
                <q-btn :label="isEdit ? $t('roles.edit.btn_action') : $t('roles.create.btn_action')" color="primary"
                    class="btn-border-radius" @click="submit" />
            </div>
            <!-- </q-page-sticky> -->
            <div class="flex justify-center q-pb-lg" v-else>
                <q-btn :label="$t('roles.create.btn_cancel')" outline color="primary" class="btn-border-radius q-mr-lg"
                    @click="close" />
                <q-btn :label="isEdit ? $t('roles.edit.btn_action') : $t('roles.create.btn_action')" color="primary"
                    class="btn-border-radius" @click="submit" />
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import SubTitleSettingsPanel from 'components/SettingsUser/SubTitleSettingsPanel.vue';
import InputTitleModal from '../General/InputTitleModal.vue';
import { useRoleStore } from 'stores/role';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const $q = useQuasar();
const roleStore = useRoleStore();
const props = defineProps({
    role: {
        type: Object,
        default: () => ({}),
    },
});
const form = ref({
    role_id: '',
    name: '',
    title: '',
    description: '',
    color: '',
});
const errors = ref({
    name: false,
    nameMsg: '',
    title: false,
    titleMsg: '',
});
const isEdit = ref(false);
const validateForm = () => {
    let isValid = true;
    // Validar el nombre (al menos 5 caracteres)
    if (!form.value.name) {
        errors.value.name = true;
        errors.value.nameMsg = t('roles.errors.name_required');
        isValid = false;
    } else if (form.value.name.length < 3) {
        errors.value.name = true;
        errors.value.nameMsg = t('roles.errors.name_min_length');
        isValid = false;
    } else {
        errors.value.name = false;
        errors.value.nameMsg = '';
    }

    if (!form.value.title) {
        errors.value.title = true;
        errors.value.titleMsg = t('roles.errors.title_required');
        isValid = false;
    } else if (form.value.title.length < 3) {
        errors.value.title = true;
        errors.value.titleMsg = t('roles.errors.title_min_length');
        isValid = false;
    } else {
        errors.value.title = false;
        errors.value.titleMsg = '';
    }

    return isValid;
};

// Detectar si es móvil
const isMobile = computed(() => {
    return window.innerWidth <= 600; // Define tu umbral para mobile aquí
});

// Estilo de dialog
const dialogStyle = computed(() => {
    return isMobile.value ? 'width: 100vw; max-width: 100vw; max-height: 100vh !important;height: 98vh;margin: 8px;' : 'width: 800px; max-width: 100vw;';
});

// Cargar roles y preparar el formulario al montar
onMounted(async () => {
    try {
        if (role.value && role.value.role_id) {
            form.value = { ...role.value };
            isEdit.value = true;
        } else {
            resetForm();
            isEdit.value = false;
        }
        fetchRoles();
    } catch (error) {
        console.error('Error fetching role:', error);
    }
});

// Cerrar y resetear el formulario
const close = () => {
    roleStore.show_modal_role = false;
    resetForm();
};

// Resetear el formulario
const resetForm = () => {
    form.value = {
        name: '',
        title: '',
        description: '',
        color: '',
        role_id: '',  // Asegúrate de resetear role_id
    };
    isEdit.value = false;
};

// Manejar la acción de submit (crear o editar usuario)
const submit = async () => {
    if (!validateForm()) {
        $q.notify({
            type: 'negative',
            message: t('roles.errors.fix_errors'),
        });
        return;
    }

    $q.loading.show();

    if (isEdit.value) {
        console.log('edit data ', form.value);

        // Eliminamos el  __typename para que sea igual al input que espera graphql
        delete form.value.__typename;
        await roleStore.updateRole(form.value).then(response => {
            console.log('response: ' + response)
            $q.notify({
                type: 'positive',
                message: response,
            });

        }).catch(error => {
            console.log('error catch: ' + error)
        });
        // Aquí va la lógica para editar el usuario
    } else {
        console.log('create data ', form.value);
        // Aquí va la lógica para crear el usuario
        try {
            // Enviar datos del usuario
            const newRole = await roleStore.createRole(form.value);
            $q.notify({
                type: 'positive',
                message: newRole.message,
            });
            close();
        } catch (error) {
            console.error(error);
            $q.notify({
                type: 'negative',
                message: 'Error creating role',
            });
        }
    }

    $q.loading.hide();
    close();
};

</script>
<script>
export default {
    name: 'RoleFormModal',
}
</script>
<style scoped>
/* Aquí puedes agregar estilos personalizados */
.input-form {
    padding: 0px 0px 4px 0px;
}

.input-bottom {
    padding: 0px 0px 20px 0px;
}

@media (max-width: 855px) {

    .form-modal {
        padding: 24px 24px;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .btn-password-edit {
        height: 40px !important;
        width: 100%;
        font-size: 12px;
    }

    .btn-verified-edit {
        height: 60px !important;
        width: 100%;
    }

    .input-password-edit {
        width: 75%;
        padding: 0px;
    }

    .btn-password-back {
        padding: 0px 8px;
        margin-right: 8px;
    }
}

/* Estilo para pantallas pequeñas: ratio libre */
@media (min-width: 855px) {
    .form-modal {
        padding: 16px 48px;

    }

    .btn-password-edit {
        height: 56px !important;
        width: 100%;
    }

    .btn-verified-edit {
        height: 76px !important;
        width: 100%;
    }

    .input-password-edit {
        width: 82%;
        padding: 0px;
    }

    .btn-password-back {
        padding: 0px 20px;
        margin-right: 8px;
    }
}
</style>
