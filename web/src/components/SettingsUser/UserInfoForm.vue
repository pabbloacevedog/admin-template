<template>
    <div class="q-gutter-md">
        <q-input filled :label="$t('settings.account.name')" v-model="form.name" />
        <q-input filled :label="$t('settings.account.username')" v-model="form.username" />
        <q-input filled :label="$t('settings.account.email')" v-model="form.email" disable readonly />
        <q-input filled :label="$t('settings.account.personal_phone')" v-model="form.personal_phone" />
        <q-input filled :label="$t('settings.account.rut_user')" v-model="form.rut_user" />
    </div>
    <div class="q-ma-md flex justify-end">
        <q-btn label="Save Changes" color="primary" class="q-mt-md btn-border-radius" @click="saveChanges" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from 'stores/auth';
import { useQuasar, Dark } from 'quasar';
const authStore = useAuthStore();
const $q = useQuasar();
const form = ref({
    user_id: '',
    rut_user: '',
    name: '',
    username: '',
    email: '',
    personal_phone: '',
    verification_code: '',
    verified: false,
    state: '',
    avatar: '',
    role_id: '',
});
const isDarkTheme = ref(Dark.isActive);
onMounted(async () => {
    try {
        const fetchedUser = await authStore.userSettings(authStore.user.user_id);
        // user.value = fetchedUser;
        Object.assign(form.value, fetchedUser);
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

// Función para guardar cambios
const saveChanges = async () => {
    $q.loading.show()
    // Guardar cambios generales
    await authStore.updateUserSettings(form.value).then(response => {
        console.log('response: ' + response)
        updateUserInLocalStorage({
            email: form.value.email,
            name: form.value.name,
            avatar: form.value.avatar
        });
        authStore.updateUserStore(form.value)
        $q.notify({
            type: 'positive',
            message: response,
        });

    }).catch(error => {
        console.log('error catch: ' + error)
    });

    $q.loading.hide()
};
//actualiza los campos nuevos del usuario en el localstorage
const updateUserInLocalStorage = (updatedUser) => {
    let users = JSON.parse(localStorage.getItem('rememberedUsers')) || [];
    users = users.map(user =>
        user.email === updatedUser.email ? { ...user, ...updatedUser } : user
    );
    localStorage.setItem('rememberedUsers', JSON.stringify(users));
};
</script>

<script>
export default {
    name: 'UserInfoForm',
}
</script>
