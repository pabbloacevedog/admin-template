<template>
    <div class="text-center">
        <q-avatar size="150px" class="avatar-user">
            <img :src="authStore.user?.avatar" alt="User Avatar" />
        </q-avatar>
        <!-- Input para subir archivo -->
        <input type="file" ref="fileInput" @change="handleFileChange" style="display: none;" id="fileUpload" />

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
const $q = useQuasar();
const authStore = useAuthStore();
const fileInput = ref(null);
const showCropper = ref(false);
const image = ref(null);
const croppedImage = ref(null);
const nameAvatar = ref(null);
const selectFile = () => {
    fileInput.value.click();
};
const user = ref(authStore.user);
const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
        console.log('Archivo seleccionado:', file)
        showCropper.value = true
        image.value = URL.createObjectURL(file);
        nameAvatar.value = file.name
    }
}
const sendAvatarApi = async (fileAvatar) => {
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
