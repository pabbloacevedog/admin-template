<template>
    <q-page class="login-page">
        <Login />
    </q-page>
</template>

<script setup>
import Login from 'components/Login.vue'; // Ajusta la ruta según la ubicación de tu componente
</script>

<style scoped>
.login-page {
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>
