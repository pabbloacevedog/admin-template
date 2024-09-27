<template>
    <div class="q-mt-none">
        <q-card class="bg-second" flat>
            <SubTitleSettingsPanel :subtitle="$t('settings.tabs.general.personal.subtitle')" :description="$t('settings.tabs.general.personal.description')" :icon="'account_circle'" />
            <q-separator class="q-my-sm q-mx-md" />
            <q-card-section horizontal>
                <q-card-section class="col-6">
                    <!-- <q-input class="q-my-md bg-second input-none-used" filled :label="$t('settings.account.name')" readonly/> -->
                    <InputTitleSettingsPanel :title="$t('settings.account.avatar.title')" :description="$t('settings.account.avatar.description')" style="height:110px !important;"/>
                    <InputTitleSettingsPanel :title="$t('settings.account.name.title')" :description="$t('settings.account.name.description')" />
                    <InputTitleSettingsPanel :title="$t('settings.account.username.title')" :description="$t('settings.account.username.description')" />
                    <InputTitleSettingsPanel :title="$t('settings.account.email.title')" :description="$t('settings.account.email.description')"/>
                    <InputTitleSettingsPanel :title="$t('settings.account.personal_phone.title')" :description="$t('settings.account.personal_phone.description')" />
                    <InputTitleSettingsPanel :title="$t('settings.account.rut_user.title')" :description="$t('settings.account.rut_user.description')" />
                </q-card-section>

                <q-card-section class="col-6">
                    <AvatarUploader :size_avatar="'100px'"/>
                    <q-input class="q-my-md" filled  v-model="form.name" />
                    <q-input class="q-my-md" filled  v-model="form.username" />
                    <q-input class="q-my-md" filled  v-model="form.email" disable readonly />
                    <q-input class="q-my-md" filled  v-model="form.personal_phone" />
                    <q-input class="q-my-md" filled  v-model="form.rut_user" />
                </q-card-section>
            </q-card-section>
        </q-card>

    </div>
    <div class="q-ma-md flex justify-end">
        <q-btn label="Save Changes" color="primary" class="btn-border-radius" @click="saveChanges" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from 'stores/auth';
import { useQuasar, Dark } from 'quasar';
import SubTitleSettingsPanel from './SubTitleSettingsPanel.vue';
import InputTitleSettingsPanel from './InputTitleSettingsPanel.vue';
import AvatarUploader from './AvatarUploader.vue';
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
<style lang="css">
</style>
