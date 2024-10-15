<template>
    <div class="text-start">
        <q-avatar :size="size_avatar" class="avatar-user">
            <img :src="authStore.user?.avatar" alt="User Avatar" />
        </q-avatar>
        <!-- Input para subir archivo -->
        <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;" id="fileUpload" />

        <!-- Botón para seleccionar archivo -->
        <q-btn color="primary" icon="photo_camera" @click="selectFile" flat class="btn-upload-avatar bg-first" />
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
                    <q-btn label="Save" color="primary" class="q-mt-md btn-border-radius" @click="saveCroppedImage" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from 'stores/auth';
import { useQuasar } from 'quasar';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.bubble.css';
import auth from 'src/router/auth';
const $q = useQuasar();
const authStore = useAuthStore();
const fileInput = ref(null);
const showCropper = ref(false);
const image = ref(null);
const croppedImage = ref(null);
const nameAvatar = ref(null);

const props = defineProps({
    size_avatar: String,
});
const selectFile = () => {
    fileInput.value.click();
};
//actualiza los campos nuevos del usuario en el localstorage
const updateUserInLocalStorage = (updatedUser) => {
    let users = JSON.parse(localStorage.getItem('rememberedUsers')) || [];
    users = users.map(user =>
        user.email === updatedUser.email ? { ...user, ...updatedUser } : user
    );
    localStorage.setItem('rememberedUsers', JSON.stringify(users));
};
const user = ref(authStore.user);
const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
        showCropper.value = true
        image.value = URL.createObjectURL(file);
        nameAvatar.value = file.name
    }
}
const sendAvatarApi = async (fileAvatar) => {
    await authStore.uploadAvatar(fileAvatar).then((response) => {
        // Actualiza el avatar en el objeto user
        user.value = { ...user.value, avatar: response };
        const new_data = {
            email: user.value.email,
            name: user.value.name,
            avatar: response
        }
        updateUserInLocalStorage(new_data);
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
    if (canvas) {
        const img = canvas.toBlob(blob => {
            const fileAvatar = new File([blob], nameAvatar.value, { type: "image/jpeg" });
            sendAvatarApi(fileAvatar)
        }, "image/jpeg");
    }
}
</script>
<script>
export default {
    name: 'AvatarUploader',
}
</script>
<style scoped>

.btn-upload-avatar {
    top: 30px;
    right: 30px;
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
        right: 20% !important;
        bottom: 35px !important;
    }
}
</style>
