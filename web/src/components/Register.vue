<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <q-page class="register-page">
        <div class="register-container row no-wrap justify-center items-center q-mt-xl">
            <div class="left-section col-6 q-px-xl">
                <div class="form-container">
					<h3>{{ $t('register.title') }}</h3>
					<p>{{ $t('register.description') }}</p>
                    <q-form @submit="onSubmit">
                        <q-input v-model="email" :label="$t('register.email')" type="email" outlined class="q-mb-md" />
                        <q-input v-model="password" :label="$t('register.pass')" type="password" outlined class="q-mb-md" />
                        <q-btn :label="$t('register.btn_signup')" type="submit" color="primary" class="full-width q-mb-md" />
                    </q-form>
                    <p>{{$t('register.old_user')}} <q-btn flat :label="$t('register.login')" class="text-primary" @click="router.push('/login')"/></p>
                </div>

            </div>
            <div class="right-section col-6 q-px-xl">
                <div class="content">
                    <q-img src="https://picsum.photos/800/500" contain />
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

const username = ref('');
const email = ref('');
const password = ref('');

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();

const onSubmit = async () => {
    try {
        const user = await authStore.register({ email: email.value, password: password.value });
        $q.notify({
            type: 'positive',
            message: 'Registro exitoso'
        });
        router.push('/login');
    } catch (error) {
        // Error handling is already done in the store, no need to do anything here
    }
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
    width: 80%;
    max-width: 1200px;
    background: #ffffff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
}

.left-section {
    background: #f8f9fa;
}

.right-section {
    background: #ffffff;
}

.form-container {
    width: 80%;
    margin: 0 auto;
}

.full-width {
    width: 100%;
}
</style>

