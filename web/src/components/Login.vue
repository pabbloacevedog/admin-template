<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <q-page class="login-page">
        <div class="login-container row no-wrap justify-center items-center q-mt-xl">
            <!-- Columna izquierda: Imagen -->
            <div class="left-section col-xl-6 col-md-6 q-px-xl">
                <div class="content">
                    <q-img src="https://picsum.photos/500/300" :ratio="16 / 9" />
                </div>
            </div>

            <!-- Columna derecha: Formulario -->
            <div class="right-section col-xl-5 col-md-6 q-px-xl">
                <div class="form-container">
                    <h3>{{ $t('login.title') }}</h3>
                    <p>{{ $t('login.description') }}</p>
                    <q-form @submit="onSubmit" autocomplete="on">
                        <q-input v-model="email" :label="$t('login.email')" type="email" outlined class="q-mb-md"
                            autocomplete="email" :error="errors.email" :error-message="errors.emailMsg" />
                        <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'"
                            :label="$t('login.password')" autocomplete="new-password" :error="errors.password"
                            :error-message="errors.passwordMsg" class="q-mb-md">
                            <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                    @click="isPwd = !isPwd" />
                            </template>
                        </q-input>

                        <div class="row justify-end q-mb-md">
                            <q-btn flat :label="$t('login.forgot_password')" class="text-primary"
                                @click="router.push('/forgot_password')" />
                        </div>

                        <q-btn :label="$t('login.btn_login')" type="submit" color="primary"
                            class="full-width q-mb-md" />
                    </q-form>
                    <p>{{ $t('login.new_user') }} <q-btn flat :label="$t('login.sign_up')" class="text-primary"
                            @click="router.push('/register')" /></p>
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
const email = ref('');
const password = ref('');

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();
const isPwd = ref(true);
const errors = ref({
    password: false,
    passwordMsg: '',
    email: false,
    emailMsg: '',
});

// Validación de contraseñas
const validateForm = () => {
    let isValid = true;

    // Verificar si la nueva contraseña está vacía
    if (!password.value) {
        errors.value.password = true;
        errors.value.passwordMsg = t('login.errors.password_required');
        isValid = false;
    } else {
        errors.value.password = false;
        errors.value.passwordMsg = '';
    }
    // Verificar si la nueva contraseña está vacía
    if (!email.value) {
        errors.value.email = true;
        errors.value.emailMsg = t('login.errors.email_required');
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
            message: t('login.errors.fix_errors'),
        });
        return;
    }
    try {
        const user = await authStore.login({ email: email.value, password: password.value });
        $q.notify({
            type: 'positive',
            message: `Bienvenido ${user.email}`
        });
        router.push('/settings');
    } catch (error) {
        console.log('error catch: ' + error)
        // Error handling is already done in the store, no need to do anything here
        // $q.notify({
        // 	type: 'negative',
        // 	message: `Error: ${error.message || 'Login failed'}`
        // });
    }
};

onMounted(() => {
    authStore.clearError();
});
</script>

<style scoped>
.login-page {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background: url('https://picsum.photos/1200/800') no-repeat center center;
    background-size: cover;
}

.login-container {
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

.separator {
    text-align: center;
    margin: 20px 0;
}

.separator span {
    display: inline-block;
    background: #fff;
    padding: 0 10px;
    position: relative;
    z-index: 1;
}

.separator:before {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background: #ccc;
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 0;
}

.full-width {
    width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .login-container {
        flex-direction: column;
    }

    .left-section,
    .right-section {
        min-width: 100%;
        flex: none;
    }
}
</style>
