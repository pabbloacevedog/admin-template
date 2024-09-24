<template>
    <q-page class="register-page">
        <Register />
    </q-page>
</template>

<script setup>
import Register from 'components/Register.vue'; // Ajusta la ruta según la ubicación de tu componente
</script>

<style scoped>
.register-page {
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>
