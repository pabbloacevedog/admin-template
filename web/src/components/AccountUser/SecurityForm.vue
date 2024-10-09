<template>
    <div class="q-mt-none">
        <q-card class="bg-second fit" flat>
            <SubTitleSettingsPanel :subtitle="$t('account.tabs.security.title')"
                :description="$t('account.tabs.security.description')" :icon="'fingerprint'" />
            <q-separator class="q-my-sm q-mx-md" />
            <q-card-section horizontal>
                <q-card-section class="col-5 q-pr-none">
                    <InputTitleSettingsPanel :title="$t('account.account.current_password.title')"
                        :description="$t('account.account.current_password.description')" />
                    <InputTitleSettingsPanel :title="$t('account.account.new_password.title')"
                        :description="$t('account.account.new_password.description')" />
                    <InputTitleSettingsPanel :title="$t('account.account.confirm_password.title')"
                        :description="$t('account.account.confirm_password.description')" />
                </q-card-section>

                <q-card-section class="col-7 q-pl-none">
                    <q-input filled type="password" :label="$t('account.security.current_password')"
                        v-model="form.currentPassword" :error="errors.currentPassword"
                        :error-message="errors.currentPasswordMsg" />
                    <q-input filled type="password" :label="$t('account.security.new_password')"
                        v-model="form.newPassword" :error="errors.newPassword" :error-message="errors.newPasswordMsg" />
                    <q-input filled type="password" :label="$t('account.security.confirm_password')"
                        v-model="form.confirmPassword" :error="errors.confirmPassword"
                        :error-message="errors.confirmPasswordMsg" />
                </q-card-section>
            </q-card-section>
        </q-card>
        <div class="q-ma-md flex justify-end">
            <q-btn label="Save Changes" color="primary" class="btn-border-radius" @click="saveChanges" />
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'stores/auth';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import SubTitleSettingsPanel from './SubTitleSettingsPanel.vue';
import InputTitleSettingsPanel from './InputTitleSettingsPanel.vue';
const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();
const form = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
});

const errors = ref({
    currentPassword: false,
    currentPasswordMsg: '',
    newPassword: false,
    newPasswordMsg: '',
    confirmPassword: false,
    confirmPasswordMsg: ''
});
// Valida los campos de cambio de contraseña
const validatePasswordForm = () => {
    let isValid = true;

    if (!form.value.currentPassword) {
        errors.value.currentPassword = true;
        errors.value.currentPasswordMsg = 'Current password is required.';
        isValid = false;
    } else {
        errors.value.currentPassword = false;
        errors.value.currentPasswordMsg = '';
    }

    if (!form.value.newPassword) {
        errors.value.newPassword = true;
        errors.value.newPasswordMsg = 'New password is required.';
        isValid = false;
    } else if (form.value.newPassword === form.value.currentPassword) {
        errors.value.newPassword = true;
        errors.value.newPasswordMsg = 'New password cannot be the same as the current password.';
        isValid = false;
    } else {
        errors.value.newPassword = false;
        errors.value.newPasswordMsg = '';
    }

    if (form.value.newPassword !== form.value.confirmPassword) {
        errors.value.confirmPassword = true;
        errors.value.confirmPasswordMsg = 'Passwords do not match.';
        isValid = false;
    } else {
        errors.value.confirmPassword = false;
        errors.value.confirmPasswordMsg = '';
    }

    return isValid;
};
// Función para guardar cambios
const saveChanges = async () => {


    if (!validatePasswordForm()) {
        $q.notify({
            type: 'negative',
            message: t('account.errors.please_fix_errors'),
        });
        return;
    }
    $q.loading.show()
    // Llama a la acción de Pinia para cambiar la contraseña
    await authStore.changePassword({
        currentPassword: form.value.currentPassword,
        newPassword: form.value.newPassword
    }).then(response => {
        console.log('response: ' + response)
        $q.notify({
            type: 'positive',
            message: response,
        });
        router.push('/login');

    }).catch(error => {
        console.log('error catch: ' + error)
    });
    $q.loading.hide()
};
</script>
<script>
export default {
    name: 'SecurityForm',
}
</script>
