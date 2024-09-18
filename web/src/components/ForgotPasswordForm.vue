<!-- ForgotPasswordForm.vue -->
<template>
    <div class="login-container row justify-center items-center q-mt-xl">
        <div class="col-12 col-md-8 col-lg-6 q-px-md">
            <div class="form-container">
                <h3>{{ $t('forgot_password.title') }}</h3>
                <p>{{ $t('forgot_password.description') }}</p>
                <q-form @submit="handleSubmit" autocomplete="on">
                    <q-input v-model="email" :label="$t('forgot_password.email')" type="email" outlined class="q-mb-md"
                        autocomplete="email" :error="errors.email" :error-message="errors.emailMsg" />
                    <q-btn :label="$t('forgot_password.btn_send')" type="submit" color="primary"
                        class="full-width q-mb-md" />
                </q-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, toRefs, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    email: String,
    errors: Object,
});

const { t } = useI18n();
const emit = defineEmits(['submitForm']);
const email = ref(props.email);

const handleSubmit = () => {
    emit('submitForm');
};
</script>
