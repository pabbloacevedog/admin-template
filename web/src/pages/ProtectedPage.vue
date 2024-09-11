<template>
    <q-page class="protected-page">
        <div class="overlay"></div>
        <div class="content-container row justify-center items-center">
            <div class="text-center q-pa-xl">
                <h1 class="text-white">{{ user }}</h1> <!-- Muestra el nombre del usuario -->
                <p class="text-white">You are logged in and can see this page.</p>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const user = ref(null);  // Hacemos 'user' reactivo

onMounted(async () => {
    try {
        authStore.clearError();
        const fetchedUser = await authStore.userSettings("9623d813-04a2-4886-a4c3-7a669ff36a22");
        user.value = fetchedUser;  // Asignamos el valor a 'user'
    } catch (error) {
        console.error("Error fetching user:", error);
    }
});
</script>


<style scoped>
.protected-page {
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
