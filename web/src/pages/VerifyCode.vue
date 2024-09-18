<!-- VerifyCode.vue -->
<template>
    <q-page class="verify-code-page">
        <div class="login-container row no-wrap justify-center items-center q-mt-xl q-px-md">
            <!-- Ajustamos las clases de columna para hacer la página responsiva -->
            <div class="col-12 col-md-8 col-lg-6 q-px-md">
                <div class="form-container">
                    <h3>{{ $t('verify_code.title') }}</h3>
                    <p>{{ $t('verify_code.description') }}</p>
                    <q-form @submit="onSubmit" autocomplete="on">
                        <q-input v-model="verification_code" :label="$t('verify_code.code')" type="text" outlined
                            :error="errors.code" :error-message="errors.codeMsg" class="q-mb-md" />
                        <q-btn :label="$t('verify_code.btn_send')" type="submit" color="primary"
                            class="full-width q-mb-md" />
                    </q-form>
                </div>
            </div>
        </div>
    </q-page>
</template>
<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';  // Importar useI18n

// Obtener $t desde useI18n
const { t } = useI18n();
const verification_code = ref('');
const authStore = useAuthStore();
const $q = useQuasar();
const router = useRouter();
const errors = ref({
    code: false,
    codeMsg: '',
});
// Validación de contraseñas
const validateForm = () => {
    let isValid = true;

    // Verificar si la nueva contraseña está vacía
    if (!verification_code.value) {
        errors.value.code = true;
        errors.value.codeMsg = t('verify_code.errors.code_required');
        isValid = false;
    } else {
        errors.value.code = false;
        errors.value.codeMsg = '';
    }

    return isValid;
};
const onSubmit = async () => {
    if (!validateForm()) {
        $q.notify({
            type: 'negative',
            message: t('verify_code.errors.fix_errors'),
        });
        return;
    }
    await authStore.verifyCode(verification_code.value).then(response => {
        console.log('response: ' + response)
        $q.notify({
            type: 'positive',
            message: response,
        });
        router.push('/reset_password');

    }).catch(error => {
        console.log('error catch: ' + error)
    });
};
</script>
<script>
export default {
    name: 'VerifyCode',
}
</script>
