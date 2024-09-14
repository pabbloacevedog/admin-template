<template>
    <q-page class="reset-password-page">
        <div class="login-container row no-wrap justify-center items-center q-mt-xl">
            <div class="col-6 q-px-xl">
                <div class="form-container">
                    <h3>{{ $t('reset_password.title') }}</h3>
                    <p>{{ $t('reset_password.description') }}</p>
                    <q-form @submit="onSubmit" autocomplete="on">
                        <!-- Input para la nueva contraseña -->
                        <q-input v-model="newPassword" filled :type="isPwd ? 'password' : 'text'"
                            :label="$t('reset_password.new_password')" autocomplete="new-password"
                            :error="errors.newPassword" :error-message="errors.newPasswordMsg"
                            class="q-mb-md">
                            <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                    @click="isPwd = !isPwd" />
                            </template>
                        </q-input>

                        <!-- Input para confirmar la nueva contraseña -->
                        <q-input v-model="confirmPassword" filled :type="isPwd ? 'password' : 'text'"
                            :label="$t('reset_password.confirm_password')" autocomplete="new-password"
                            :error="errors.confirmPassword" :error-message="errors.confirmPasswordMsg"
                            class="q-mb-md">
                            <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                    @click="isPwd = !isPwd" />
                            </template>
                        </q-input>

                        <q-btn :label="$t('reset_password.btn_send')" type="submit" color="primary"
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

const newPassword = ref('');
const confirmPassword = ref('');
const authStore = useAuthStore();
const $q = useQuasar();
const router = useRouter();
const isPwd = ref(true);

const errors = ref({
    newPassword: false,
    newPasswordMsg: '',
    confirmPassword: false,
    confirmPasswordMsg: ''
});

// Validación de contraseñas
const validateForm = () => {
    let isValid = true;

    // Verificar si la nueva contraseña está vacía
    if (!newPassword.value) {
        errors.value.newPassword = true;
        errors.value.newPasswordMsg = 'New password is required.';
        isValid = false;
    } else {
        errors.value.newPassword = false;
        errors.value.newPasswordMsg = '';
    }

    // Verificar si las contraseñas coinciden
    if (newPassword.value !== confirmPassword.value) {
        errors.value.confirmPassword = true;
        errors.value.confirmPasswordMsg = 'Passwords do not match.';
        isValid = false;
    } else {
        errors.value.confirmPassword = false;
        errors.value.confirmPasswordMsg = '';
    }

    return isValid;
};

const onSubmit = async () => {
    if (!validateForm()) {
        $q.notify({
            type: 'negative',
            message: 'Please fix the errors before proceeding.',
        });
        return;
    }

    try {
        await authStore.resetPassword(newPassword.value);
        $q.notify({
            type: 'positive',
            message: 'Password reset successfully!',
        });
        router.push('/login');
    } catch (error) {
        $q.notify({
            type: 'negative',
            message: 'Error: ' + (error.message || 'Failed to reset password'),
        });
    }
};
</script>

<script>
export default {
    name: 'RessetPassword',
}
</script>
<style scoped>
.reset-password-page {
    /* Estilos para la página de restablecimiento de contraseña */
}
</style>
