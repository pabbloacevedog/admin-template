<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <q-page class="verify-page">
        <div class="row no-wrap justify-center items-center q-mt-xl q-px-md">
            <!-- Columna izquierda: Mensaje de verificación -->
            <div class="col-12 col-md-8 col-lg-6 q-px-md">
                <div class="form-container">
                    <div class="row justify-center">
                        <q-icon name="verified" size="56px" class="q-my-md text-center" color="primary" />
                    </div>
                    <h3 class="text-h4 text-center q-mb-lg">{{ $t('verify_email.title') }}</h3>
                    <p v-if="!successMessage && !errorMessage" class="text-center q-mb-xl">{{
                        $t('verify_email.verifying') }}</p>
                    <p v-if="successMessage">{{ successMessage }}</p>
                    <p v-if="errorMessage" class="text-negative">{{ errorMessage }}</p>
                    <div class="row justify-center">
                        <q-spinner-bars v-if="!successMessage && !errorMessage" color="primary" size="8em" />
                        <q-icon v-else-if="successMessage" name="check_circle" color="green" size="8em" />
                        <q-icon v-else-if="errorMessage" name="error" color="red" size="8em" />
                    </div>

                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'stores/auth';
import { useI18n } from 'vue-i18n'; // Importar useI18n
import {
    QSpinnerPuff
} from 'quasar'
// Obtener $t desde useI18n
const { t } = useI18n();

const successMessage = ref('');
const errorMessage = ref('');

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const verifyEmail = async () => {

    const token = route.query.token; // Obtener el token desde la URL

    if (!token) {
        errorMessage.value = t('verify_email.errors.token_missing');
        $q.loading.hide();
        return;
    }
    // Retrasar la verificación para mostrar el mensaje por al menos 1 segundo
    setTimeout(async () => {
        await authStore.verifyEmailToken(token).then(response => {
            successMessage.value = t('verify_email.success');
            $q.notify({
                type: 'positive',
                message: response,
            });
            // Redirigir al usuario después de la verificación exitosa
            router.push('/login');
        }).catch(error => {
            errorMessage.value = t('verify_email.errors.invalid_token');
            $q.notify({
                type: 'negative',
                message: t('verify_email.errors.invalid_token'),
            });
        });
        $q.loading.hide();
    }, 2000); // Retraso de 1 segundo

};

onMounted(() => {
    // Limpiar errores al cargar el componente
    authStore.clearError();
    // Llamar automáticamente a verifyEmail cuando se monta el componente
    verifyEmail();
});
</script>
