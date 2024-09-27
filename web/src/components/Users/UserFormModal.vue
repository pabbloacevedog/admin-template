<template>
    <q-dialog v-model="localModel" @hide="resetForm">
        <q-card>
            <q-card-header>
                <q-toolbar>
                    <q-toolbar-title>{{ isEdit ? $t('user.edit.title') : $t('user.create.title') }}</q-toolbar-title>
                    <q-btn flat icon="close" @click="close" />
                </q-toolbar>
            </q-card-header>
            <q-card-section>
                <q-form @submit.prevent="submit">
                    <q-input filled v-model="form.name" label="$t('user.name')" required />
                    <q-input filled v-model="form.username" label="$t('user.username')" required />
                    <q-input filled v-model="form.email" label="$t('user.email')" type="email" required />
                    <q-input filled v-model="form.personal_phone" label="$t('user.personal_phone')" required />
                    <q-input filled v-model="form.rut_user" label="$t('user.rut_user')" required />
                </q-form>
            </q-card-section>
            <q-card-actions>
                <q-btn label="$t('common.cancel')" color="negative" @click="close" />
                <q-btn label="$t('common.submit')" color="primary" @click="submit" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    isOpen: Boolean,
    user: {
        type: Object,
        default: () => ({}),
    },
});
const localModel = ref(props.isOpen);
const user = ref(props.user);
console.log(user.value,'user')
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
        form.value = user.value;
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
