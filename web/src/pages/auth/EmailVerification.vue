<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <q-page class="verify-page">
        <div class="verify-container row no-wrap justify-center items-center q-mt-xl">
            <!-- Columna izquierda: Mensaje de verificación -->
            <div class="left-section col-xl-6 col-md-6 q-px-xl">
                <div class="message-container">
                    <h3>{{ $t('verify_email.title') }}</h3>
                    <p>{{ $t('verify_email.description') }}</p>
                    <q-btn :label="$t('verify_email.btn_verify')" type="button" color="primary"
                        class="full-width q-mb-md" @click="verifyEmail" />
                    <p v-if="successMessage">{{ successMessage }}</p>
                    <p v-if="errorMessage" class="text-negative">{{ errorMessage }}</p>
                </div>
            </div>
            <!-- Columna derecha: Imagen -->
            <div class="right-section col-xl-6 col-md-6 q-px-xl">
                <div class="content">
                    <q-img src="https://picsum.photos/800/500" :ratio="16 / 9" />
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth';
import { useI18n } from 'vue-i18n';  // Importar useI18n

// Obtener $t desde useI18n
const { t } = useI18n();

const successMessage = ref('');
const errorMessage = ref('');

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();
console.log('route',route.query)
const verifyEmail = async () => {
    $q.loading.show()
    const token = route.query.token; // Obtener el token desde la URL

    if (!token) {
        errorMessage.value = t('verify_email.errors.token_missing');
        return;
    }

    await authStore.verifyEmailToken(token).then(response => {
        console.log('response',response)
        successMessage.value = t('verify_email.success');
        $q.notify({
            type: 'positive',
            message: response,
        });
        // Redirigir al usuario después de la verificación exitosa
        router.push('/login');
    }).catch(error => {
        console.log('error',error)
        errorMessage.value = t('verify_email.errors.invalid_token');
        $q.notify({
            type: 'negative',
            message: t('verify_email.errors.invalid_token'),
        });
    });
    $q.loading.hide()
};

onMounted(() => {
    // Limpiar errores al cargar el componente
    authStore.clearError();
});
</script>
