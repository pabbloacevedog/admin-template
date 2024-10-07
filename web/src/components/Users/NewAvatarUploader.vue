<template>
    <div class="text-start">
        <q-avatar :size="size_avatar" class="avatar-user">
            <img :src="avatarPreview || user?.avatar" alt="User Avatar" v-if="avatarPreview || user?.avatar"/>
            <q-icon v-else name="account_circle" color="second" style="font-size: 120px;width: 100px;height: 100px;" class="p-qa-none" />
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
import { useQuasar } from 'quasar';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.bubble.css';
import { useUserStore } from 'stores/user';
const userStore = useUserStore();
const $q = useQuasar();
const fileInput = ref(null);
const showCropper = ref(false);
const image = ref(null);
const croppedImage = ref(null);
const nameAvatar = ref(null);
const avatarPreview = ref(null); // Almacena la imagen previsualizada
const croppedBlob = ref(null);  // Almacena el blob del avatar recortado

const props = defineProps({
    size_avatar: String,
    user: {
        type: Object,
        default: () => ({}),
    },
});


const selectFile = () => {
    fileInput.value.click();
};

const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
        showCropper.value = true;
        image.value = URL.createObjectURL(file);
        nameAvatar.value = file.name;
    }
};

const saveCroppedImage = async () => {
    const { canvas } = croppedImage.value.getResult();
    if (canvas) {
        const img = canvas.toBlob(blob => {
            croppedBlob.value = blob; // Guardar el blob
            avatarPreview.value = URL.createObjectURL(blob); // Previsualizar la imagen
            userStore.new_avatar = croppedBlob.value; // Emitir el avatar recortado al padre
            showCropper.value = false;
        }, "image/jpeg");
    }
};
</script>
<script>
export default {
    name: 'NewAvatarUploader',
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
        right: 7%;
    }
}

@media (max-width: 1023px) {
    .btn-upload-avatar {
        right: 9%;
    }
}

@media (max-width: 768px) {
    .btn-upload-avatar {
        right: 9%;
    }
}

@media (max-width: 541px) {
    .btn-upload-avatar {
        right: 20% !important;
        bottom: 35px !important;
    }
}
</style>
