<template>
    <div class="row q-mt-md items-center">
        <div class="col-6 col-md-6 flex flex-center">
            <h4 class="text-h6 text-center q-mb-lg">{{ $t('settings.theme.dark_mode') }}</h4>
        </div>
        <div class="col-6 col-md-6 flex flex-center">
            <q-toggle size="lg" v-model="isDarkTheme" val="isDarkTheme" @update:model-value="toggleTheme" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Dark } from 'quasar';
import { useAuthStore } from 'stores/auth';
// Estado para el tema oscuro
const isDarkTheme = ref(Dark.isActive);
const authStore = useAuthStore();
// Función para cambiar el tema
const toggleTheme = () => {
    console.log('Toggle');
    Dark.toggle();
    // Obtener los temas guardados por usuario
    let themes = JSON.parse(localStorage.getItem('themes')) || {};
    // Actualizar el tema del usuario actual
    themes[authStore.user.user_id] = Dark.isActive ? 'dark' : 'light';
    // Guardar los temas en localStorage
    localStorage.setItem('themes', JSON.stringify(themes));
    isDarkTheme.value = Dark.isActive;
};

</script>
