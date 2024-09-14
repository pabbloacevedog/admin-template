<!-- ForgotPassword.vue -->
<template>
    <q-page class="forgot-password-page">
        <div class="login-container row no-wrap justify-center items-center q-mt-xl">
            <div class="col-6 q-px-xl">
                <div class="form-container">
                    <h3>{{ $t('forgot_password.title') }}</h3>
                    <p>{{ $t('forgot_password.description') }}</p>
                    <q-form @submit="onSubmit" autocomplete="on">
                        <q-input v-model="email" required :label="$t('forgot_password.email')" type="email" outlined
                            class="q-mb-md" autocomplete="email" />
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
const email = ref('');
const authStore = useAuthStore();
const $q = useQuasar();
const router = useRouter();
const onSubmit = async () => {
    try {
        await authStore.forgotPassword(email.value);
        $q.notify({
            type: 'positive',
            message: 'Email sent successfully!',
        });
        // Redirigir al componente de verificación de código
        router.push('/verify_code');
    } catch (error) {
        $q.notify({
            type: 'negative',
            message: 'Error: ' + error.message || 'Failed to send reset link',
        });
    }
};
</script>
<script>
export default {
    name: 'ForgotPassword',
}
</script>
