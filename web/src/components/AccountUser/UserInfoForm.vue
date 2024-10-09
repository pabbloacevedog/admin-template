<template>
    <div class="q-mt-none">
        <q-card class="bg-second" flat>
            <SubTitleSettingsPanel :subtitle="$t('account.tabs.general.personal.subtitle')"
                :description="$t('account.tabs.general.personal.description')" :icon="'account_circle'" />
            <q-separator class="q-my-sm q-mx-md" />
            <q-card-section horizontal>
                <q-card-section class="col-5 q-pr-none">
                    <!-- <q-input class="q-my-md bg-second input-none-used" filled :label="$t('settings.account.name')" readonly/> -->
                    <InputTitleSettingsPanel :title="$t('account.account.avatar.title')"
                        :description="$t('account.account.avatar.description')" style="height:110px !important;" />
                    <InputTitleSettingsPanel :title="$t('account.account.name.title')"
                        :description="$t('account.account.name.description')" />
                    <InputTitleSettingsPanel :title="$t('account.account.username.title')"
                        :description="$t('account.account.username.description')" />
                    <InputTitleSettingsPanel :title="$t('account.account.email.title')"
                        :description="$t('account.account.email.description')" />
                    <InputTitleSettingsPanel :title="$t('account.account.personal_phone.title')"
                        :description="$t('account.account.personal_phone.description')" />
                    <!-- <InputTitleSettingsPanel :title="$t('settings.account.rut_user.title')"
                        :description="$t('settings.account.rut_user.description')" /> -->
                </q-card-section>

                <q-card-section class="col-7 q-pl-none">
                    <AvatarUploader :size_avatar="'100px'" />
                    <q-input class="q-my-md" filled v-model="form.name" />
                    <q-input class="q-my-md" filled v-model="form.username" />
                    <q-input class="q-my-md" filled v-model="form.email" disable readonly />
                    <q-input class="input-bottom" filled v-model="form.personal_phone"
                        :label="$t('Phone: (###) ### - ####')" type="tel" mask="(###) ### - ####" />
                    <!-- <q-input class="q-my-md" filled v-model="form.rut_user" /> -->
                </q-card-section>
            </q-card-section>
        </q-card>
        <div class="q-ma-md flex justify-end">
            <q-btn label="Save Changes" color="primary" class="btn-border-radius" @click="saveChanges" />
        </div>
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
    user_id: authStore.user.user_id,
    // rut_user: '',
    name: '',
    username: '',
    email: '',
    personal_phone: '',
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
    // Eliminamos el role, avatar, verified y el __typename para que sea igual al input que espera graphql
    delete form.value.role;
    delete form.value.avatar;
    delete form.value.verified;
    delete form.value.__typename;
    await authStore.updateUserSettings(form.value).then(response => {
        console.log('response: ' + response)
        // const new_data = {
        //     email: form.value.email,
        //     name: form.value.name,
        //     avatar: authStore.user.avatar
        // }
        // // updateUserInLocalStorage(new_data);
        // form.value = { avatar: authStore.user.avatar, ...form.value }
        // authStore.updateUserStore(form.value)
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
<style lang="css"></style>
