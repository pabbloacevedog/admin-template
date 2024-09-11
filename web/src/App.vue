<template>
	<q-layout view="lHh Lpr lFf">
		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';

// Restaurar el estado de autenticación
onMounted(() => {
	const authStore = useAuthStore();
	authStore.restoreUser();
});
</script>

<style>
/* estilos aquí */
</style>
  