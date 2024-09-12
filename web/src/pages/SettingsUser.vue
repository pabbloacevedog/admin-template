<template>
    <q-page class="profile-page">
        <div class="row q-mb-md justify-between items-center">
            <div>
                <h3>{{ user?.name }}'s Profile</h3>
                <p>Manage your details and personal preferences here.</p>
            </div>
            <q-btn label="Upgrade" color="primary" flat />
        </div>

        <q-separator />

        <!-- Tabs -->
        <q-tabs v-model="activeTab" class="q-mt-md">
            <q-tab name="general" label="General" />
            <q-tab name="security" label="Security" />
            <q-tab name="preferences" label="Preferences" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated>
            <!-- General Tab -->
            <q-tab-panel name="general">
                <div class="q-gutter-md q-mt-md">
                    <!-- Avatar -->
                    <div class="row items-center">
                        <q-avatar size="75px" :src="user?.avatar" />
                        <q-btn label="Change photo" color="primary" outline class="q-ml-md" />
                    </div>

                    <!-- Basic Info -->
                    <q-input filled label="Name" v-model="form.name" />
                    <q-input filled label="Username" v-model="form.username" />
                    <q-input filled label="Email Address" v-model="form.email" disable readonly />
                    <q-input filled label="Phone Number" v-model="form.personal_phone" />
                    <q-input filled label="RUT" v-model="form.rut_user" />

                    <!-- Account Status -->
                    <q-toggle label="Verified" v-model="form.verified" />

                    <!-- Role -->
                    <q-select filled label="Role" v-model="form.role_id" :options="roles" option-value="id"
                        option-label="name" disable readonly/>
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

        <!-- Save Button -->
        <q-btn label="Save Changes" color="primary" class="q-mt-md" @click="saveChanges" />
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useQuasar } from 'quasar';
// Mock roles and options
const $q = useQuasar();
const roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' },
];

const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
];

const dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY'];

const authStore = useAuthStore();
const user = ref(null);  // Datos del usuario
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

const activeTab = ref('general');

onMounted(async () => {
    try {
        const fetchedUser = await authStore.userSettings(authStore.user.user_id);
        user.value = fetchedUser;
        Object.assign(form.value, fetchedUser); // Inicializa el formulario con los datos del usuario
    } catch (error) {
        console.error("Error fetching user:", error);
    }
});

// Función para manejar la actualización de los datos del usuario
const saveChanges = async () => {
    try {
        await authStore.updateUserSettings(form.value);  // Llama a la acción del store para actualizar los datos
        $q.notify({
			type: 'positive',
			message: 'User settings updated successfully'
		});
    } catch (error) {
        $q.notify({
			type: 'negative',
			message: 'Error saving changes: ' + error
		});
    }
};
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
</style>

<script>
export default {
    name: 'SettingsUser'
}
</script> -->
