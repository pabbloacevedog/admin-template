<template>
    <div class="q-mt-none fit">
        <q-card class="bg-second fit" flat>
            <SubTitleSettingsPanel :subtitle="$t('settings.tabs.theme.title')"
                :description="$t('settings.tabs.theme.description')" :icon="'dark_mode'" />
            <q-separator class="q-my-sm q-mx-md" />
            <q-card-section horizontal>
                <q-card-section class="col-6">
                    <InputTitleSettingsPanel :title="$t('settings.theme.dark_mode.title')"
                        :description="$t('settings.theme.dark_mode.description')" />
                </q-card-section>

                <q-card-section class="col-6" align="right">
                        <q-toggle size="lg" v-model="isDarkTheme" val="isDarkTheme" @update:model-value="toggleTheme"  />
                </q-card-section>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Dark } from 'quasar';
import { useAuthStore } from 'stores/auth';
import SubTitleSettingsPanel from './SubTitleSettingsPanel.vue';
import InputTitleSettingsPanel from './InputTitleSettingsPanel.vue';
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
onMounted(async () => {
    try {
        // const fetchedUser = await authStore.userSettings(authStore.user.user_id);
        // user.value = fetchedUser;
        // Object.assign(form.value, fetchedUser);
        // Cargar el tema guardado al montar el componente
        const themes = JSON.parse(localStorage.getItem('themes')) || {};
        const savedTheme = themes[authStore.user.user_id];
        if (savedTheme) {
            Dark.set(savedTheme === 'dark');
            isDarkTheme.value = Dark.isActive;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
});
</script>
<script>
export default {
    name: 'ThemeToggle',
}
</script>
