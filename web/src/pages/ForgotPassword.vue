<!-- ForgotPassword.vue -->
<template>
    <q-page class="forgot-password-page">
        <div class="login-container row no-wrap justify-center items-center q-mt-xl q-px-md">
            <!-- Ajustamos las clases de columna para hacer la página responsiva -->
            <div class="col-12 col-md-8 col-lg-6 q-px-md">
                <div class="form-container">
                    <h3>{{ $t('forgot_password.title') }}</h3>
                    <p>{{ $t('forgot_password.description') }}</p>
                    <q-form @submit="onSubmit" autocomplete="on">
                        <q-input v-model="email" :label="$t('forgot_password.email')" type="email" outlined
                            class="q-mb-md" autocomplete="email" :error="errors.email"
                            :error-message="errors.emailMsg" />
                        <q-btn :label="$t('forgot_password.btn_send')" type="submit" color="primary"
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
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';  // Importar useI18n

// Obtener $t desde useI18n
const { t } = useI18n();
const email = ref('');
const authStore = useAuthStore();
const $q = useQuasar();
const router = useRouter();
const errors = ref({
    email: false,
    emailMsg: '',
});
// Validación de contraseñas
const validateForm = () => {
    let isValid = true;
    // Verificar si la nueva contraseña está vacía
    if (!email.value) {
        errors.value.email = true;
        errors.value.emailMsg = t('forgot_password.errors.email_required');
        isValid = false;
    } else {
        errors.value.email = false;
        errors.value.emailMsg = '';
    }

    return isValid;
};
const onSubmit = async () => {
    if (!validateForm()) {
        $q.notify({
            type: 'negative',
            message: t('forgot_password.errors.fix_errors'),
        });
        return;
    }
    await authStore.forgotPassword(email.value).then(response => {
        console.log('response: ' + response)
        $q.notify({
            type: 'positive',
            message: response,
        });
        router.push('/verify_code');

    }).catch(error => {
        console.log('error catch: ' + error)
    });
};
</script>
<script>
export default {
    name: 'ForgotPassword',
}
</script>
