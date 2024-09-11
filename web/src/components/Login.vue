<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<q-page class="login-page">
		<div class="login-container row no-wrap justify-center items-center q-mt-xl">
			<div class="left-section col-6 q-px-xl">
				<div class="content">
					<q-img src="https://picsum.photos/500/300" :ratio="16 / 9" />
				</div>
			</div>
			<div class="right-section col-6 q-px-xl">
				<div class="form-container">
					<h2>Welcome back!</h2>
					<p>Start managing your finance faster and better</p>
					<q-form @submit="onSubmit">
						<q-input v-model="email" label="Email" type="email" outlined class="q-mb-md" />
						<q-input v-model="password" label="Password" type="password" outlined class="q-mb-md" />
						<div class="row justify-end q-mb-md">
							<q-btn flat label="Forgot password?" class="text-primary" />
						</div>
						<q-btn label="Login" type="submit" color="primary" class="full-width q-mb-md" />
					</q-form>
					<!-- <div class="separator">
                        <span>or</span>
                    </div> -->
					<!-- <q-btn-group flat class="full-width">
                        <q-btn flat round label="Google" icon="fa-brands fa-google" class="q-mb-md" />
                        <q-btn flat round label="Facebook" icon="fa-brands fa-facebook" class="q-mb-md" />
                    </q-btn-group> -->
					<p>Don't you have an account? <q-btn flat label="Sign Up" class="text-primary"
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

const email = ref('');
const password = ref('');

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();

const onSubmit = async () => {
	try {
		const username = await authStore.login({ email: email.value, password: password.value });
		$q.notify({
			type: 'positive',
			message: `Bienvenido ${username}`
		});
		router.push('/protected');
	} catch (error) {
		// Error handling is already done in the store, no need to do anything here
		$q.notify({
			type: 'negative',
			message: `Error: ${error.message || 'Login failed'}`
		});
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
	position: relative;
}

.login-container {
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
</style>
