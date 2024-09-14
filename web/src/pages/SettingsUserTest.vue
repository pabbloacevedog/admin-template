<template>
    <q-page class="profile-page">
        <div class="row q-ma-md justify-between items-center">
            <div class="col-6 col-md-6">
                <div class="text-h4">{{ $t('settings.title') }}</div>
            </div>
            <div class="col-6 col-md-6 text-right">
                <q-btn label="logout" color="negative" class="q-mt-md" @click="logOut" />
            </div>
        </div>

        <div class="row name-avatar">
            <div class="col-4 col-md-4">
                <q-avatar size="100px">
                    <img :src="user?.avatar" alt="User Avatar" />
                </q-avatar>
            </div>
            <div class="col-6 col-md-6">
                <h6>{{ user?.name }}'s Profile</h6>
            </div>
        </div>

        <!-- Tabs -->
        <q-tabs v-model="activeTab" class="q-mt-md">
            <q-tab name="general" :label="$t('settings.tabs.general')" />
            <q-tab name="security" :label="$t('settings.tabs.security')" />
            <q-tab name="preferences" :label="$t('settings.tabs.company')" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated>
            <!-- General Tab -->
            <q-tab-panel name="general">
                <div class="q-gutter-md q-mt-md">
                    <q-input filled :label="$t('settings.account.name')" v-model="form.name" />
                    <q-input filled :label="$t('settings.account.username')" v-model="form.username" />
                    <q-input filled :label="$t('settings.account.email')" v-model="form.email" disable readonly />
                    <q-input filled :label="$t('settings.account.personal_phone')" v-model="form.personal_phone" />
                    <q-input filled :label="$t('settings.account.rut_user')" v-model="form.rut_user" />
                </div>
            </q-tab-panel>

            <!-- Security Tab -->
            <q-tab-panel name="security">
                <div class="q-gutter-md q-mt-md">
                    <q-input filled type="password" :label="$t('settings.security.current_password')"
                        v-model="form.currentPassword" :error="errors.currentPassword"
                        :error-message="errors.currentPasswordMsg" />
                    <q-input filled type="password" :label="$t('settings.security.new_password')"
                        v-model="form.newPassword" :error="errors.newPassword" :error-message="errors.newPasswordMsg" />
                    <q-input filled type="password" :label="$t('settings.security.confirm_password')"
                        v-model="form.confirmPassword" :error="errors.confirmPassword"
                        :error-message="errors.confirmPasswordMsg" />
                </div>
            </q-tab-panel>

            <!-- Preferences Tab -->
            <q-tab-panel name="preferences">
                <div class="q-gutter-md q-mt-md">
                    <q-toggle label="Automatic time zone" v-model="form.auto_time_zone" />
                    <q-select filled label="Language" v-model="form.language" :options="languages" option-value="code"
                        option-label="name" />
                    <q-select filled label="Date format" v-model="form.date_format" :options="dateFormats" />
                </div>
            </q-tab-panel>
        </q-tab-panels>

        <div class="row q-ma-md justify-between items-center">
            <div>
                <q-btn label="Save Changes" color="primary" class="q-mt-md" @click="saveChanges" />
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
const user = ref(null);

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
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const errors = ref({
    currentPassword: false,
    currentPasswordMsg: '',
    newPassword: false,
    newPasswordMsg: '',
    confirmPassword: false,
    confirmPasswordMsg: ''
});

const activeTab = ref('general');

// Valida los campos de cambio de contraseña
// Valida los campos de cambio de contraseña
const validatePasswordForm = () => {
    let isValid = true;

    if (!form.value.currentPassword) {
        errors.value.currentPassword = true;
        errors.value.currentPasswordMsg = 'Current password is required.';
        isValid = false;
    } else {
        errors.value.currentPassword = false;
        errors.value.currentPasswordMsg = '';
    }

    if (!form.value.newPassword) {
        errors.value.newPassword = true;
        errors.value.newPasswordMsg = 'New password is required.';
        isValid = false;
    } else if (form.value.newPassword === form.value.currentPassword) {
        errors.value.newPassword = true;
        errors.value.newPasswordMsg = 'New password cannot be the same as the current password.';
        isValid = false;
    } else {
        errors.value.newPassword = false;
        errors.value.newPasswordMsg = '';
    }

    if (form.value.newPassword !== form.value.confirmPassword) {
        errors.value.confirmPassword = true;
        errors.value.confirmPasswordMsg = 'Passwords do not match.';
        isValid = false;
    } else {
        errors.value.confirmPassword = false;
        errors.value.confirmPasswordMsg = '';
    }

    return isValid;
};


// Función para guardar cambios
const saveChanges = async () => {
    if (activeTab.value === 'security') {
        if (!validatePasswordForm()) {
            $q.notify({
                type: 'negative',
                message: 'Please fix the errors before proceeding.'
            });
            return;
        }

        try {
            // Llama a la acción de Pinia para cambiar la contraseña
            await authStore.changePassword({
                currentPassword: form.value.currentPassword,
                newPassword: form.value.newPassword
            });

            $q.notify({
                type: 'positive',
                message: 'Password updated successfully!'
            });
        } catch (error) {
            $q.notify({
                type: 'negative',
                message: 'Error updating password: ' + error.message
            });
        }
    } else {
        // Guardar cambios generales
        try {
            await authStore.updateUserSettings(form.value);
            $q.notify({
                type: 'positive',
                message: 'User settings updated successfully!'
            });
        } catch (error) {
            $q.notify({
                type: 'negative',
                message: 'Error saving changes: ' + error
            });
        }
    }
};
const logOut = async () => {
        try {
            if (await authStore.logOut()) {
                router.push('/login');
            }

        } catch (error) {
            $q.notify({
                type: 'negative',
                message: 'Error doing logout: ' + error
            });
        }

};
onMounted(async () => {
    try {
        const fetchedUser = await authStore.userSettings(authStore.user.user_id);
        user.value = fetchedUser;
        Object.assign(form.value, fetchedUser);
    } catch (error) {
        console.error('Error fetching user:', error);
    }
});

</script>
<script>
export default {
    name: 'SettingsUserTest',
}
</script>

<style scoped>
.profile-page {
    max-width: 800px;
    margin: auto;
}

.q-gutter-md {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

.name-avatar {
    display: flex;
    align-items: center;
    padding: 2%;
    background-color: #f4f4f4;
    border-radius: 25px;
    text-align: center;
}
</style>
