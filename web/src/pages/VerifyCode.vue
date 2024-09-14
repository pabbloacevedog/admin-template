<!-- VerifyCode.vue -->
<template>
    <q-page class="verify-code-page">
        <div class="login-container row no-wrap justify-center items-center q-mt-xl">
            <div class="col-6 q-px-xl">
                <div class="form-container">
                    <h3>{{ $t('verify_code.title') }}</h3>
                    <p>{{ $t('verify_code.description') }}</p>
                    <q-form @submit="onSubmit" autocomplete="on">
                        <q-input v-model="verification_code" required :label="$t('verify_code.code')" type="text"
                            outlined class="q-mb-md" />
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

const verification_code = ref('');
const authStore = useAuthStore();
const $q = useQuasar();
const router = useRouter();

const onSubmit = async () => {
    try {
        await authStore.verifyCode(verification_code.value);
        $q.notify({
            type: 'positive',
            message: 'Code verified successfully!',
        });
        // Redirigir al formulario para cambiar contraseña
        router.push('/reset_password');
    } catch (error) {
        $q.notify({
            type: 'negative',
            message: 'Error: ' + error.message || 'Invalid code',
        });
    }
};
</script>
<script>
export default {
    name: 'VerifyCode',
}
</script>
