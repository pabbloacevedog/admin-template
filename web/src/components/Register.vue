<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <q-page class="register-page">
        <div class="register-container row justify-center items-center q-mt-xl">
            <!-- Columna izquierda: Formulario -->
            <div class="col-xl-6 col-md-6">
                <div class="form-container form-register">
                    <div class="text-h4 text-center q-my-lg">{{ $t('register.title') }}</div>
                    <div class="text-h6 text-second text-center q-ma-lg">{{ $t('register.description') }}</div>
                    <q-form @submit="onSubmit" autocomplete="on">
                        <q-input v-model="name" :label="$t('register.name')" type="text" filled class="q-mb-md"
                            autocomplete="name" :error="errors.name" :error-message="errors.nameMsg" />
                        <q-input v-model="email" :label="$t('register.email')" type="email" filled class="q-mb-md"
                            autocomplete="email" :error="errors.email" :error-message="errors.emailMsg" />
                        <q-input v-model="password" :label="$t('register.pass')" type="password" filled class="q-mb-md"
                            :error="errors.password" :error-message="errors.passwordMsg" />
                        <q-btn :label="$t('register.btn_signup')" type="submit" color="primary"
                            class="full-width q-mb-md btn-border-radius" />
                        <div class="row justify-center q-mb-md">
                            <p>{{ $t('register.old_user') }} <q-btn flat :label="$t('register.login')"
                                    class="text-primary " @click="router.push('/login')" /></p>
                        </div>
                    </q-form>

                </div>
            </div>
            <!-- Columna derecha: Imagen -->
            <div class="col-xl-6 col-md-6 col-xs-12 col-sm-12 q-pa-xs full-height">
                <q-img src="https://picsum.photos/500/300" style="border-radius: 15px;" class="img-register full-height"
                    fit="cover" />
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'stores/auth';
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
const validateForm = () => {
    let isValid = true;

    // Validar el nombre (al menos 5 caracteres)
    if (!name.value) {
        errors.value.name = true;
        errors.value.nameMsg = t('register.errors.name_required');
        isValid = false;
    } else if (name.value.length < 3) {
        errors.value.name = true;
        errors.value.nameMsg = t('register.errors.name_min_length');
        isValid = false;
    } else {
        errors.value.name = false;
        errors.value.nameMsg = '';
    }

    // Validar el email (formato válido)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value) {
        errors.value.email = true;
        errors.value.emailMsg = t('register.errors.email_required');
        isValid = false;
    } else if (!emailPattern.test(email.value)) {
        errors.value.email = true;
        errors.value.emailMsg = t('register.errors.email_invalid');
        isValid = false;
    } else {
        errors.value.email = false;
        errors.value.emailMsg = '';
    }

    // Validar la contraseña (al menos 6 caracteres, una mayúscula y un número)
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!password.value) {
        errors.value.password = true;
        errors.value.passwordMsg = t('register.errors.password_required');
        isValid = false;
    } else if (!passwordPattern.test(password)) {
        errors.value.password = true;
        errors.value.passwordMsg = t('register.errors.password_invalid');
        isValid = false;
    } else {
        errors.value.password = false;
        errors.value.passwordMsg = '';
    }

    return isValid;
};
// Validación de contraseñas
// const validateForm = () => {
//     let isValid = true;

//     // Verificar si la nueva contraseña está vacía
//     if (!password.value) {
//         errors.value.password = true;
//         errors.value.passwordMsg = t('register.errors.password_required');
//         isValid = false;
//     } else {
//         errors.value.password = false;
//         errors.value.passwordMsg = '';
//     }
//     // Verificar si la nueva contraseña está vacía
//     if (!email.value) {
//         errors.value.email = true;
//         errors.value.emailMsg = t('register.errors.email_required');
//         isValid = false;
//     } else {
//         errors.value.email = false;
//         errors.value.emailMsg = '';
//     }
//     // Verificar si la nueva contraseña está vacía
//     if (!name.value) {
//         errors.value.name = true;
//         errors.value.nameMsg = t('register.errors.name_required');
//         isValid = false;
//     } else {
//         errors.value.name = false;
//         errors.value.nameMsg = '';
//     }
//     return isValid;
// };
const onSubmit = async () => {

    if (!validateForm()) {
        $q.notify({
            type: 'negative',
            message: t('register.errors.fix_errors'),
        });
        return;
    }
    $q.loading.show()
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
    $q.loading.hide()
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
    border-radius: 20px;
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
/* Estilo para pantallas grandes: ratio de 1 */
@media (min-width: 856px) {
    .img-register {
        aspect-ratio: 1;
        /* Mantiene una proporción 1:1 en pantallas grandes */
    }
}

/* Estilo para pantallas pequeñas: ratio libre */
@media (max-width: 855px) {
    .img-register {
        aspect-ratio: auto;
        /* Ratio libre en pantallas móviles */
    }
}
@media (max-width: 855px) {

    .form-register {
        padding: 16px 16px;
    }
}

/* Estilo para pantallas pequeñas: ratio libre */
@media (min-width: 855px) {


    .form-register {
        padding: 16px 48px;
    }
}
</style>
