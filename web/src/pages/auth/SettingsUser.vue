<template>
    <q-page class="profile-page">
        <div class="row q-ma-md justify-between items-center">
            <div class="col-6 col-md-6">
                <div class="text-h4">{{ $t('settings.title') }}</div>
            </div>
        </div>
        <div class="col-12" style="position: relative;">
            <q-card class="col-12 w-100 div-rounded-radius" flat>
                <q-card-section v-if="$q.platform.is.mobile" class="row col-12 items-center justify-center">
                    <q-card-section class="col-4 col-md-4 col-xs-12 text-center items-center justify-center">
                        <q-avatar size="168px" class="avatar-user">
                            <img :src="user?.avatar" alt="User Avatar" />
                        </q-avatar>

                        <!-- Input para subir archivo -->
                        <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;"
                            id="fileUpload" />

                        <!-- Botón para seleccionar archivo -->
                        <q-btn color="primary" icon="photo_camera" @click="selectFile" flat class="btn-upload-avatar" />

                        <!-- Modal para recortar imagen -->
                        <q-dialog v-model="showCropper" persistent>
                            <q-card>
                                <cropper :src="image" :auto-zoom="true" ref="croppedImage" :stencil-size="{
                                    width: 280,
                                    height: 280
                                }" image-restriction="stencil" />
                                <q-card-actions align="right">
                                    <q-btn label="Cancel" flat color="primary" class="q-mt-md btn-border-radius"
                                        @click="showCropper = false" />
                                    <q-btn label="Save" color="primary" class="q-mt-md btn-border-radius"
                                        @click="saveCroppedImage" />
                                </q-card-actions>
                            </q-card>
                        </q-dialog>
                    </q-card-section>
                    <q-card-section class="col-6 col-md-6 col-xs-12 text-center items-center justify-center">
                        <div class="text-h4">{{ user?.name }}</div>
                        <div class="text-h6 text-second">{{ user?.email }}</div>
                    </q-card-section>
                </q-card-section>
                <q-card-section v-else horizontal class="row col-12 items-center justify-center q-pa-none">
                    <q-card-section class="col-4 col-md-4 col-xs-12 text-center items-center justify-center">
                        <q-avatar size="150px" class="avatar-user">
                            <img :src="user?.avatar" alt="User Avatar" />
                        </q-avatar>

                        <!-- Input para subir archivo -->
                        <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;"
                            id="fileUpload" />

                        <!-- Botón para seleccionar archivo -->
                        <q-btn color="primary" icon="photo_camera" @click="selectFile" flat class="btn-upload-avatar" />

                        <!-- Modal para recortar imagen -->
                        <q-dialog v-model="showCropper" persistent>
                            <q-card>
                                <cropper :src="image" :auto-zoom="true" ref="croppedImage" :stencil-size="{
                                    width: 280,
                                    height: 280
                                }" image-restriction="stencil" />
                                <q-card-actions align="right">
                                    <q-btn label="Cancel" flat color="primary" class="q-mt-md btn-border-radius"
                                        @click="showCropper = false" />
                                    <q-btn label="Save" color="primary" class="q-mt-md btn-border-radius"
                                        @click="saveCroppedImage" />
                                </q-card-actions>
                            </q-card>
                        </q-dialog>
                    </q-card-section>
                    <q-card-section class="col-6 col-md-6 col-xs-12 text-center items-center justify-center q-pa-none">
                        <div class="text-h4 q-mb-md">{{ user?.name }}</div>
                        <div class="text-h6 text-second">{{ user?.email }}</div>
                    </q-card-section>
                </q-card-section>
            </q-card>
        </div>

        <!-- Tabs -->
        <q-tabs v-model="activeTab" class="q-mt-md">
            <q-tab name="general" :label="$t('settings.tabs.general')" />
            <q-tab name="security" :label="$t('settings.tabs.security')" />
            <q-tab name="theme" :label="$t('settings.tabs.theme')" /> <!-- Nuevo tab de tema -->
        </q-tabs>

        <q-tab-panels v-model="activeTab" animated class="div-rounded-radius">
            <!-- General Tab -->
            <q-tab-panel name="general">
                <div class="q-gutter-md">
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

            <!-- Theme Tab -->
            <q-tab-panel name="theme">
                <div class="row q-mt-md items-center">
                    <div class="col-6 col-md-6 flex flex-center">
                        <h4 class="text-h6 text-center q-mb-lg">{{ $t('settings.theme.dark_mode') }}</h4>
                    </div>
                    <div class="col-6 col-md-6 flex flex-center">
                        <q-toggle size="lg" v-model="isDarkTheme" val="isDarkTheme" @update:model-value="toggleTheme" />
                    </div>
                </div>
            </q-tab-panel>
        </q-tab-panels>

        <div class="q-ma-md flex justify-end">
            <div>
                <q-btn label="Save Changes" color="primary" class="q-mt-md btn-border-radius" @click="saveChanges" />
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useQuasar, Dark } from 'quasar';
import { useRouter } from 'vue-router';
import { Cropper } from 'vue-advanced-cropper';
import { useI18n } from 'vue-i18n';  // Importar useI18n
import 'vue-advanced-cropper/dist/style.css';
import { valueFromAST } from 'graphql';
// Obtener $t desde useI18n
const { t } = useI18n();
const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
const user = ref({ avatar: '', });
// Referencia al input tipo file
const fileInput = ref(null);
const showCropper = ref(false);
const image = ref(null);
const croppedImage = ref(null);
const nameAvatar = ref(null);
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

// Estado para el tema oscuro
const isDarkTheme = ref(Dark.isActive);

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

// Función para abrir el diálogo de selección de archivo
const selectFile = () => {
    // Asegúrate de que el input se haya inicializado correctamente
    if (fileInput.value && typeof fileInput.value.click === 'function') {
        fileInput.value.click()
    } else {
        console.error('El input file no está disponible o click no es una función.')
    }
}
const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
        console.log('Archivo seleccionado:', file)
        showCropper.value = true
        image.value = URL.createObjectURL(file);
        nameAvatar.value = file.name
    }
}
// Función para guardar cambios
const saveChanges = async () => {
    $q.loading.show()
    if (activeTab.value === 'security') {
        if (!validatePasswordForm()) {
            $q.notify({
                type: 'negative',
                message: t('settings.errors.please_fix_errors'),
            });
            return;
        }
        // Llama a la acción de Pinia para cambiar la contraseña
        await authStore.changePassword({
            currentPassword: form.value.currentPassword,
            newPassword: form.value.newPassword
        }).then(response => {
            console.log('response: ' + response)
            $q.notify({
                type: 'positive',
                message: response,
            });
            router.push('/login');

        }).catch(error => {
            console.log('error catch: ' + error)
        });

    } else {
        // Guardar cambios generales
        await authStore.updateUserSettings(form.value).then(response => {
            console.log('response: ' + response)
            user.value = { ...user.value, name: form.value.name };
            updateUserInLocalStorage({
                email: user.value.email,
                name: form.value.name,
                avatar: user.value.avatar
            });
            authStore.updateUserStore(user.value)
            $q.notify({
                type: 'positive',
                message: response,
            });
            // router.push('/login');

        }).catch(error => {
            console.log('error catch: ' + error)
        });

    }
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
onMounted(async () => {
    try {
        const fetchedUser = await authStore.userSettings(authStore.user.user_id);
        user.value = fetchedUser;
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
const sendAvatarApi = async (fileAvatar) => {
    // try {
    //     await authStore.uploadAvatar(fileAvatar)
    //     const fetchedUser = await authStore.userSettings(authStore.user.user_id);
    //     user.value = fetchedUser;
    //     Object.assign(form.value, fetchedUser);
    //     showCropper.value = false
    //     nameAvatar.value = null
    //     $q.notify({
    //         type: 'positive',
    //         message: 'Avatar uploaded successfully',
    //     });
    // } catch (error) {
    //     console.error('Error fetching user:', error);
    // }
    await authStore.uploadAvatar(fileAvatar).then((response) => {
        console.log('response: ' + response);
        // Actualiza el avatar en el objeto user
        user.value = { ...user.value, avatar: response };

        showCropper.value = false
        nameAvatar.value = null
        $q.notify({
            type: 'positive',
            message: 'Avatar uploaded successfully',
        });
        authStore.updateUserStore(user.value)
    }).catch((error) => {
        console.error('Error uploading avatar:', error);
        $q.notify({
            type: 'negative',
            message: 'Error uploading avatar',
        });
    });
}

const saveCroppedImage = async () => {
    const { canvas } = croppedImage.value.getResult();
    console.log('canvas', canvas)
    if (canvas) {
        const img = canvas.toBlob(blob => {
            const fileAvatar = new File([blob], nameAvatar.value, { type: "image/jpeg" });
            console.log(fileAvatar, 'fileAvatar')
            sendAvatarApi(fileAvatar)
        }, "image/jpeg");
        console.log(img, 'img')
    }
}
</script>
<script>
export default {
    name: 'SettingsUser',
}
</script>

<style scoped>
.profile-page {
    max-width: 1000px;
    margin: auto;
}

.q-gutter-md {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
}

.q-avatar {
    border: 2px solid #fff;
    /* Opcional: añadir un borde blanco */
}

.btn-upload-avatar {
    position: absolute;
    bottom: 20px;
    right: calc(50% - 70px);
    background-color: white;
    border-radius: 50%;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
    padding: 8px;
}

@media (max-width: 1024px) {
    .btn-upload-avatar {
        right: 25%;
    }
}

@media (max-width: 1023px) {
    .btn-upload-avatar {
        right: 40%;
    }
}

@media (max-width: 768px) {
    .btn-upload-avatar {
        right: 40%;
    }
}

@media (max-width: 541px) {
    .btn-upload-avatar {
        right: 30%;
    }
}
</style>
