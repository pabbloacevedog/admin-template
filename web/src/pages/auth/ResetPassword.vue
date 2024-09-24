<template>
    <q-page class="reset-password-page">
        <div class="row no-wrap justify-center items-center q-mt-xl">
            <div class="col-12 col-md-8 col-lg-4 q-px-md">
                <div class="form-container">
                    <!-- Icono de correo -->
                    <div class="row justify-center">
                        <q-icon name="lock_open" size="56px" class="q-my-md text-center" color="primary" />
                    </div>

                    <h3 class="text-h4 text-center q-mb-lg">{{ $t('reset_password.title') }}</h3>
                    <p class="text-center q-mb-xl">{{ $t('reset_password.description') }}</p>
                    <q-form @submit="onSubmit" autocomplete="on">
                        <!-- Input para la nueva contraseña -->
                        <q-input v-model="newPassword" filled :type="isPwd ? 'password' : 'text'"
                            :label="$t('reset_password.new_password')" autocomplete="new-password"
                            :error="errors.newPassword" :error-message="errors.newPasswordMsg" class="q-mb-md">
                            <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                    @click="isPwd = !isPwd" />
                            </template>
                        </q-input>

                        <!-- Input para confirmar la nueva contraseña -->
                        <q-input v-model="confirmPassword" filled :type="isPwd ? 'password' : 'text'"
                            :label="$t('reset_password.confirm_password')" autocomplete="new-password"
                            :error="errors.confirmPassword" :error-message="errors.confirmPasswordMsg" class="q-mb-md">
                            <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                    @click="isPwd = !isPwd" />
                            </template>
                        </q-input>

                        <q-btn :label="$t('reset_password.btn_send')" type="submit" color="primary"
                            class="full-width q-mb-md btn-border-radius" />
                    </q-form>
                </div>
            </div>
        </div>
    </q-page>
</template>


<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';  // Importar useI18n

// Obtener $t desde useI18n
const { t } = useI18n();
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
        errors.value.newPasswordMsg = t('reset_password.errors.new_password_required');
        isValid = false;
    } else {
        errors.value.newPassword = false;
        errors.value.newPasswordMsg = '';
    }

    // Verificar si las contraseñas coinciden
    if (newPassword.value !== confirmPassword.value) {
        errors.value.confirmPassword = true;
        errors.value.confirmPasswordMsg = t('reset_password.errors.passwords_do_not_match');
        isValid = false;
    } else {
        errors.value.confirmPassword = false;
        errors.value.confirmPasswordMsg = '';
    }

    return isValid;
};

const onSubmit = async () => {
    $q.loading.show()
    if (!validateForm()) {
        $q.notify({
            type: 'negative',
            message: t('reset_password.errors.fix_errors'),
        });
        return;
    }

    await authStore.resetPassword(newPassword.value).then(response => {
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
    name: 'RessetPassword',
}
</script>
<style scoped>
.reset-password-page {
    /* Estilos para la página de restablecimiento de contraseña */
}
</style>
