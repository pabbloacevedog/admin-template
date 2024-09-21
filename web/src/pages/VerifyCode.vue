<!-- VerifyCode.vue -->
<template>
    <q-page class="verify-code-page">
        <div class="row no-wrap justify-center items-center q-mt-xl q-px-md">
            <div class="col-12 col-md-8 col-lg-4 q-px-md">
                <div class="form-container">
                    <!-- Icono de correo -->
                    <div class="row justify-center">
                        <q-icon name="lock" size="56px" class="q-my-md text-center" color="primary" />
                    </div>

                    <!-- Título y descripción -->
                    <h3 class="text-h4 text-center q-mb-sm">{{ $t('verify_code.title') }}</h3>
                    <p class="text-center q-mb-lg">{{ $t('verify_code.description', { email: 'amelie@untitledui.com' })
                        }}</p>

                    <!-- Código de verificación -->
                    <q-form @submit="onSubmit">
                        <!-- <div class="row justify-center">
                            <q-input v-model="verification_code_1" type="text" maxlength="1" filled
                                class="col-2 text-center text-h4 q-pa-sm" />
                            <q-input v-model="verification_code_2" type="text" maxlength="1" filled
                                class="col-2 text-center text-h4 q-pa-sm" />
                            <q-input v-model="verification_code_3" type="text" maxlength="1" filled
                                class="col-2 text-center text-h4 q-pa-sm" />
                            <q-input v-model="verification_code_4" type="text" maxlength="1" filled
                                class="col-2 text-center text-h4 q-pa-sm" />
                            <q-input v-model="verification_code_5" type="text" maxlength="1" filled
                                class="col-2 text-center text-h4 q-pa-sm" />
                            <q-input v-model="verification_code_6" type="text" maxlength="1" filled
                                class="col-2 text-center text-h4 q-pa-sm" />
                        </div> -->
                        <div class="row justify-center">
                            <q-input v-model="verification_code_1" ref="input1" @keyup="moveToNext(1)" type="text" maxlength="1" filled class="col-2 text-center text-h4 q-pa-sm" />
                            <q-input v-model="verification_code_2" ref="input2" @keyup="moveToNext(2)" type="text" maxlength="1" filled class="col-2 text-center text-h4 q-pa-sm" />
                            <q-input v-model="verification_code_3" ref="input3" @keyup="moveToNext(3)" type="text" maxlength="1" filled class="col-2 text-center text-h4 q-pa-sm" />
                            <q-input v-model="verification_code_4" ref="input4" @keyup="moveToNext(4)" type="text" maxlength="1" filled class="col-2 text-center text-h4 q-pa-sm" />
                            <q-input v-model="verification_code_5" ref="input5" @keyup="moveToNext(5)" type="text" maxlength="1" filled class="col-2 text-center text-h4 q-pa-sm" />
                            <q-input v-model="verification_code_6" ref="input6" @keyup="moveToNext(6)" type="text" maxlength="1" filled class="col-2 text-center text-h4 q-pa-sm" />
                        </div>
                        <!-- Botón enviar -->
                        <q-btn :label="$t('verify_code.btn_send')" type="submit" :loading="loadingBtn" color="primary"
                            unelevated class="full-width q-my-md btn-border-radius ">
                            <template v-slot:loading>
                                <q-spinner-bars class="on-left" />
                                Loading...
                            </template>
                        </q-btn>
                    </q-form>

                    <!-- Enlace de reenvío -->
                    <!-- <p class="text-center">
                        <q-btn flat label="Didn't receive the email?" class="q-ml-sm" @click="resendCode" />
                    </p> -->

                    <!-- Volver al login -->
                    <p class="text-center q-mt-md">
                        <q-btn flat color="grey" @click="goBackToLogin">
                            <q-icon left size="2em" name="arrow_back" />
                            <div>Back to log in</div>
                        </q-btn>
                    </p>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../stores/auth';
const authStore = useAuthStore();
const { t } = useI18n();
const $q = useQuasar();
const router = useRouter();
const loadingBtn = ref(false);

// Cada dígito del código de verificación
const verification_code_1 = ref('');
const verification_code_2 = ref('');
const verification_code_3 = ref('');
const verification_code_4 = ref('');
const verification_code_5 = ref('');
const verification_code_6 = ref('');

// Referencias a los inputs
const input1 = ref(null);
const input2 = ref(null);
const input3 = ref(null);
const input4 = ref(null);
const input5 = ref(null);
const input6 = ref(null);

// Función para mover el foco al siguiente input
const moveToNext = (inputNumber) => {
    switch (inputNumber) {
        case 1:
            if (verification_code_1.value.length === 1) input2.value.focus();
            break;
        case 2:
            if (verification_code_2.value.length === 1) input3.value.focus();
            break;
        case 3:
            if (verification_code_3.value.length === 1) input4.value.focus();
            break;
        case 4:
            if (verification_code_4.value.length === 1) input5.value.focus();
            break;
        case 5:
            if (verification_code_5.value.length === 1) input6.value.focus();
            break;
        case 6:
            // Último input, no se mueve
            break;
    }
};

// Validar el formulario
const validateForm = () => {
    return verification_code_1.value && verification_code_2.value && verification_code_3.value &&
        verification_code_4.value && verification_code_5.value && verification_code_6.value;
};

const onSubmit = async () => {
    loadingBtn.value = true;
    if (!validateForm()) {
        $q.notify({
            type: 'negative',
            message: t('verify_code.errors.fix_errors'),
        });
        loadingBtn.value = false;
        return;
    }

    const verification_code = `${verification_code_1.value}${verification_code_2.value}${verification_code_3.value}${verification_code_4.value}${verification_code_5.value}${verification_code_6.value}`;

    await authStore.verifyCode(verification_code).then(response => {
        console.log('response: ' + response)
        $q.notify({
            type: 'positive',
            message: response,
        });
        router.push('/reset_password');

    }).catch(error => {
        console.log('error catch: ' + error)
    });
    loadingBtn.value = false;
};

const goBackToLogin = () => {
    router.push('/login');
};
</script>


<script>
export default {
    name: 'VerifyCode',
};
</script>

<style scoped>
.verify-code-page {
    height: 100vh;
}

.form-container {
    background: white;
}

.text-h5 {
    font-weight: 600;
}

.full-width {
    width: 100%;
}
</style>
