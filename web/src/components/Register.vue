<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <q-page class="register-page">
        <div class="register-container row no-wrap justify-center items-center q-mt-xl">
            <!-- Columna izquierda: Formulario -->
            <div class="left-section col-xl-6 col-md-6 q-px-xl">
                <div class="form-container">
                    <h3>{{ $t('register.title') }}</h3>
                    <p>{{ $t('register.description') }}</p>
                    <q-form @submit="onSubmit" autocomplete="on">
                        <q-input v-model="name" :label="$t('register.name')" type="text" outlined class="q-mb-md"
                            autocomplete="name" :error="errors.name" :error-message="errors.namelMsg"/>
                        <q-input v-model="email" :label="$t('register.email')" type="email" outlined class="q-mb-md"
                            autocomplete="email" :error="errors.email" :error-message="errors.emailMsg"/>
                        <q-input v-model="password" :label="$t('register.pass')" type="password" outlined
                            class="q-mb-md" :error="errors.password" :error-message="errors.passwordMsg"/>
                        <q-btn :label="$t('register.btn_signup')" type="submit" color="primary"
                            class="full-width q-mb-md" />
                    </q-form>
                    <p>{{ $t('register.old_user') }} <q-btn flat :label="$t('register.login')" class="text-primary"
                            @click="router.push('/login')" /></p>
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
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../stores/auth';
import { useI18n } from 'vue-i18n';  // Importar useI18n

// Obtener $t desde useI18n
const { t } = useI18n();
const name = ref('');
const email = ref('');
const password = ref('');

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();
const errors = ref({
    password: false,
    passwordMsg: '',
    email: false,
    emailMsg: '',
    name: false,
    nameMsg: '',
});
// Validación de contraseñas
const validateForm = () => {
    let isValid = true;

    // Verificar si la nueva contraseña está vacía
    if (!password.value) {
        errors.value.password = true;
        errors.value.passwordMsg = t('register.errors.password_required');
        isValid = false;
    } else {
        errors.value.password = false;
        errors.value.passwordMsg = '';
    }
    // Verificar si la nueva contraseña está vacía
    if (!email.value) {
        errors.value.email = true;
        errors.value.emailMsg = t('register.errors.email_required');
        isValid = false;
    } else {
        errors.value.email = false;
        errors.value.emailMsg = '';
    }
    // Verificar si la nueva contraseña está vacía
    if (!name.value) {
        errors.value.name = true;
        errors.value.nameMsg = t('register.errors.name_required');
        isValid = false;
    } else {
        errors.value.name = false;
        errors.value.nameMsg = '';
    }
    return isValid;
};
const onSubmit = async () => {
    if (!validateForm()) {
        $q.notify({
            type: 'negative',
            message: t('register.errors.fix_errors'),
        });
        return;
    }
    await authStore.register({ name: name.value, email: email.value, password: password.value }).then(response => {
        console.log('response: ' + response)
        $q.notify({
            type: 'positive',
            message: response,
        });
        router.push('/login');

    }).catch(error => {
        console.log('error catch: ' + error)
    });

};

onMounted(() => {
    authStore.clearError();
});
</script>

<style scoped>
.register-page {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background: url('https://picsum.photos/1200/800') no-repeat center center;
    background-size: cover;
    position: relative;
}

.register-container {
    width: 95%;
    max-width: 1200px;
    background: #ffffff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
}

.left-section,
.right-section {
    padding: 2rem;
    min-width: 50%;
}

.form-container {
    width: 100%;
    margin: 0 auto;
}

.full-width {
    width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .register-container {
        flex-direction: column;
    }

    .left-section,
    .right-section {
        min-width: 100%;
        flex: none;
    }
}
</style>
