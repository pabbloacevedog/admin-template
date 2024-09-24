<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <q-page class="home-page">
        <div class="overlay"></div>
        <div class="content-container row justify-center items-center">
            <div class="text-center q-pa-xl">
                <h1 class="text-white">Welcome to Auth Application</h1>
                <p class="text-white">Start managing your authentication system.</p>
                <div class="row justify-center q-mt-md">
                    <q-btn label="Login" color="primary" class="q-mr-md" @click="handleLogin" />
                    <q-btn label="Register" color="secondary" @click="handleRegister" />
                </div>
            </div>
        </div>
    </q-page>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
    setup() {
        const router = useRouter();

        const handleLogin = () => {
            router.push('/login');
        };
        const handleRegister = () => {
            router.push('/register');
        };

        return {
            handleLogin,
            handleRegister,
        };
    },
};
</script>

<style scoped>
.home-page {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background: url('https://picsum.photos/1920/1080') no-repeat center center;
    background-size: cover;
    position: relative;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    /* Optional: Adds a dark overlay to the background image */
}

.content-container {
    position: relative;
    /* To ensure it sits above the overlay */
    z-index: 1;
}

.text-center {
    text-align: center;
}

.text-white {
    color: white;
}
</style>
