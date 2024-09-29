<template>
    <q-dialog v-model="localModel" @hide="resetForm" backdrop-filter="blur(4px) saturate(150%)">
        <div class="q-py-lg q-px-md bg-second div-rounded-radius h-form" style="width: 700px; max-width: 80vw;">
            <q-card class="bg-second q-px-md" flat>
                <q-card-header>
                    <q-toolbar class="div-rounded-radius q-py-xs">
                        <q-toolbar-title v-if="isEdit" >
                            <SubTitleSettingsPanel :subtitle="$t('users.edit.title')"
                            :description="$t('users.edit.description')" :icon="'supervisor_account'" />
                        </q-toolbar-title>
                        <q-toolbar-title v-else>
                            <SubTitleSettingsPanel :subtitle="$t('users.create.title')"
                            :description="$t('users.create.description')" :icon="'person_add'" />
                        </q-toolbar-title>
                        <q-btn flat icon="close" @click="close" />
                    </q-toolbar>
                </q-card-header>
                <q-card-section horizontal class="q-pt-md">
                    <q-card-section class="col-5 q-pr-none">
                        <InputTitleSettingsPanel :title="$t('users.account.avatar.title')"
                        :description="$t('users.account.avatar.description')" style="height:110px !important;" />
                        <InputTitleSettingsPanel :title="$t('users.account.name.title')"
                            :description="$t('users.account.name.description')" />
                        <InputTitleSettingsPanel :title="$t('users.account.username.title')"
                            :description="$t('users.account.username.description')" />
                        <InputTitleSettingsPanel :title="$t('users.account.email.title')"
                            :description="$t('users.account.email.description')" />
                            <InputTitleSettingsPanel :title="$t('users.account.password.title')"
                            :description="$t('users.account.email.description')" />
                        <InputTitleSettingsPanel :title="$t('users.account.personal_phone.title')"
                            :description="$t('users.account.personal_phone.description')" />
                        <InputTitleSettingsPanel :title="$t('users.account.rut_user.title')"
                            :description="$t('users.account.rut_user.description')" />
                    </q-card-section>

                    <q-card-section class="col-7 q-pl-none">
                        <NewAvatarUploader :size_avatar="'100px'" :user="user" />
                        <q-input class="q-my-md" filled v-model="form.name" :label="$t('users.account.name.title')"/>
                        <q-input class="q-my-md" filled v-model="form.username" :label="$t('users.account.username.title')"/>
                        <q-input class="q-my-md" filled v-model="form.email" :label="$t('users.account.email.title')"/>
                        <q-input class="q-my-md" filled v-model="form.password" :label="$t('users.account.password.title')"/>
                        <q-input class="q-my-md" filled v-model="form.personal_phone" :label="$t('users.account.personal_phone.title')"/>
                        <q-input class="q-my-md" filled v-model="form.rut_user" :label="$t('users.account.rut_user.title')"/>
                    </q-card-section>
                </q-card-section>
            </q-card>
            <div class="q-my-md q-px-md flex justify-end">
                <q-btn label="Cancel" outline color="primary" class="btn-border-radius q-mr-md" @click="close" />
                <q-btn label="Save Changes" color="primary" class="btn-border-radius" @click="submit" />
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SubTitleSettingsPanel from 'components/SettingsUser/SubTitleSettingsPanel.vue';
import InputTitleSettingsPanel from 'components/SettingsUser/InputTitleSettingsPanel.vue';
import NewAvatarUploader from './NewAvatarUploader.vue';

const props = defineProps({
    isOpen: Boolean,
    user: {
        type: Object,
        default: () => ({}),
    },
});
const localModel = ref(props.isOpen);
const user = ref(props.user);
console.log(user.value, 'user')
const emit = defineEmits(['close', 'create-user', 'update-user']);
const form = ref({
    name: '',
    username: '',
    email: '',
    personal_phone: '',
    rut_user: '',
});

const isEdit = ref(false);

onMounted(async () => {
    try {
        if (Object.keys(user.value).length > 0) {
            // Si el objeto user no está vacío, estamos en modo edición
            form.value = { ...user.value };
            isEdit.value = true;
        } else {
            // Si user es vacío, significa que estamos creando un nuevo usuario
            resetForm();
            isEdit.value = false;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
});

const close = () => {
    emit('close');
    resetForm();
};

const resetForm = () => {
    form.value = {
        name: '',
        username: '',
        email: '',
        personal_phone: '',
        rut_user: '',
    };
    isEdit.value = false;
};

const submit = () => {
    if (isEdit.value) {
        emit('update-user', form.value);
    } else {
        emit('create-user', form.value);
    }
    close();
};
</script>

<style scoped>
/* Aquí puedes agregar estilos personalizados */
</style>
