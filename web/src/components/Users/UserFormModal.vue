<template>
    <q-dialog v-model="userStore.show_modal_user" @hide="resetForm" backdrop-filter="blur(4px) saturate(150%)">
        <div class="q-py-lg q-px-md bg-second div-rounded-radius h-form" style="width: 800px; max-width: 100vw;">
            <q-card class="bg-second q-px-md" flat>
                <q-card-header>
                    <q-toolbar class="div-rounded-radius q-py-xs">
                        <q-toolbar-title v-if="isEdit">
                            <SubTitleSettingsPanel :subtitle="$t('users.edit.title')"
                                :description="$t('users.edit.description')" :icon="'supervisor_account'" />
                        </q-toolbar-title>
                        <q-toolbar-title v-else>
                            <SubTitleSettingsPanel :subtitle="$t('users.create.title')"
                                :description="$t('users.create.description')" :icon="'person_add'" />
                        </q-toolbar-title>
                        <q-btn round flat icon="close" @click="close" />
                    </q-toolbar>
                </q-card-header>
                <q-card-section horizontal class="q-pt-md">
                    <q-card-section class="col-5 q-pr-none">
                        <InputTitleModal :title="$t('users.account.avatar.title')"
                            :description="$t('users.account.avatar.description')" style="height:110px !important;" />
                        <InputTitleModal :title="$t('users.account.name.title')"
                            :description="$t('users.account.name.description')" />
                        <InputTitleModal :title="$t('users.account.username.title')"
                            :description="$t('users.account.username.description')" />
                        <InputTitleModal :title="$t('users.account.email.title')"
                            :description="$t('users.account.email.description')" />
                        <InputTitleModal :title="$t('users.account.password.title')"
                            :description="$t('users.account.email.description')" />
                        <InputTitleModal :title="$t('users.account.personal_phone.title')"
                            :description="$t('users.account.personal_phone.description')" />
                        <InputTitleModal :title="$t('users.account.role.title')"
                            :description="$t('users.account.role.description')" />
                        <!-- <InputTitleModal :title="$t('users.account.rut_user.title')"
                            :description="$t('users.account.rut_user.description')" /> -->
                    </q-card-section>

                    <q-card-section class="col-7 q-pl-none">
                        <NewAvatarUploader :size_avatar="'100px'" :user="user" />
                        <q-input class="q-mt-md q-mb-none" filled v-model="form.name"
                            :label="$t('users.account.name.title')" type="text" autocomplete="name" :error="errors.name"
                            :error-message="errors.nameMsg" />
                        <q-input class="input-form" filled v-model="form.username"
                            :label="$t('users.account.username.title')" type="text" />
                        <q-input class="q-mb-none q-mt-md" filled v-model="form.email"
                            :label="$t('users.account.email.title')" type="email" autocomplete="email"
                            :error="errors.email" :error-message="errors.emailMsg" />
                        <div v-if="isEdit" class="flex justify-end input-bottom">
                            <q-btn icon="arrow_back" v-if="!edit_pass" outline color="primary" style="max-height: 55px;"
                                class="btn-border-radius q-mr-md" @click="edit_pass = !edit_pass" />
                            <q-btn label="Edit password" icon="lock" icon-right="lock_open" v-if="edit_pass" outline
                                color="primary" style="height: 56px; width: 100%;" class="btn-border-radius q-my-none"
                                @click="edit_pass = !edit_pass" />
                            <q-input v-else v-model="form.password" filled :type="isPwd ? 'password' : 'text'"
                                style="width: 82%; padding: 0px;" :label="$t('users.account.password.title')"
                                :error="errors.password" :error-message="errors.passwordMsg">
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                        @click="isPwd = !isPwd" />
                                </template>
                            </q-input>
                        </div>
                        <div v-else class="q-my-none">
                            <q-input v-model="form.password" filled :type="isPwd ? 'password' : 'text'"
                                :label="$t('users.account.password.title')" :error="errors.password"
                                :error-message="errors.passwordMsg">
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                        @click="isPwd = !isPwd" />
                                </template>
                            </q-input>
                        </div>

                        <q-input class="input-bottom" filled v-model="form.personal_phone"
                            :label="$t('Phone: (###) ### - ####')" type="tel" mask="(###) ### - ####" />
                        <!-- q-select para los roles -->
                        <q-select class="input-bottom" filled v-model="selectedRole" :options="roles"
                            :error="errors.role" :error-message="errors.roleMsg" option-label="label"
                            option-value="value" :label="$t('users.account.role.title')">
                        </q-select>
                        <!-- <q-input class="input-bottom" filled v-model="form.rut_user"
                            :label="$t('users.account.rut_user.title')" /> -->
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
import InputTitleModal from './InputTitleModal.vue';
import NewAvatarUploader from './NewAvatarUploader.vue';
import { useUserStore } from 'stores/user';
import { useRoleStore } from 'stores/role';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const $q = useQuasar();
const roleStore = useRoleStore();
const roles = ref([]);
const userStore = useUserStore();
const isPwd = ref(true);
const edit_pass = ref(true);
const props = defineProps({
    user: {
        type: Object,
        default: () => ({}),
    },
});
const selectedRole = ref(null); // nuevo ref para el select
const user = ref(props.user);
const form = ref({
    name: '',
    username: '',
    email: '',
    personal_phone: '',
    password: '',
    // rut_user: '',
    role_id: '',  // Inicializa con vacío para evitar conflictos
});
const errors = ref({
    password: false,
    passwordMsg: '',
    email: false,
    emailMsg: '',
    name: false,
    nameMsg: '',
    role: false,
    roleMsg: '',
});
const isEdit = ref(false);
const validateForm = () => {
    let isValid = true;
    // Validar el nombre (al menos 5 caracteres)
    if (!form.value.name) {
        errors.value.name = true;
        errors.value.nameMsg = t('users.errors.name_required');
        isValid = false;
    } else if (form.value.name.length < 3) {
        errors.value.name = true;
        errors.value.nameMsg = t('users.errors.name_min_length');
        isValid = false;
    } else {
        errors.value.name = false;
        errors.value.nameMsg = '';
    }

    // Validar el email (formato válido)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.value.email) {
        errors.value.email = true;
        errors.value.emailMsg = t('users.errors.email_required');
        isValid = false;
    } else if (!emailPattern.test(form.value.email)) {
        errors.value.email = true;
        errors.value.emailMsg = t('users.errors.email_invalid');
        isValid = false;
    } else {
        errors.value.email = false;
        errors.value.emailMsg = '';
    }
    // Validar el rol (select debe ser obligatorio)
    if (!selectedRole.value) {
        errors.value.role = true;
        errors.value.roleMsg = t('users.errors.role_required');
        isValid = false;
    } else {
        errors.value.role = false;
        errors.value.roleMsg = '';
    }
    // Validar la contraseña (al menos 6 caracteres, una mayúscula y un número)
    if (!isEdit.value || !edit_pass.value) {
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!form.value.password) {
            errors.value.password = true;
            errors.value.passwordMsg = t('users.errors.password_required');
            isValid = false;
        } else if (!passwordPattern.test(form.value.password)) {
            errors.value.password = true;
            errors.value.passwordMsg = t('users.errors.password_invalid');
            isValid = false;
        } else {
            errors.value.password = false;
            errors.value.passwordMsg = '';
        }
    }


    return isValid;
};


// Cargar roles y preparar el formulario al montar
onMounted(async () => {
    try {
        if (user.value && user.value.role_id) {
            form.value = { ...user.value };
            selectedRole.value = {
                label: user.value.role.title,
                value: Number(user.value.role.role_id)
            }

            isEdit.value = true;
        } else {
            resetForm();
            isEdit.value = false;
        }
        fetchRoles();
    } catch (error) {
        console.error('Error fetching user:', error);
    }
});

// Cargar los roles desde la store
const fetchRoles = async () => {
    const result = await roleStore.getAllRoles();
    roles.value = result.map(role => ({
        label: role.title,    // Lo que se muestra en el select
        value: Number(role.role_id),  // El valor que se selecciona (role_id)
    }));
};

// Cerrar y resetear el formulario
const close = () => {
    userStore.show_modal_user = false;
    resetForm();
};

// Resetear el formulario
const resetForm = () => {
    form.value = {
        name: '',
        username: '',
        email: '',
        personal_phone: '',
        // rut_user: '',
        role_id: '',  // Asegúrate de resetear role_id
    };
    isEdit.value = false;
};

// Manejar la acción de submit (crear o editar usuario)
const submit = async () => {
    if (!validateForm()) {
        $q.notify({
            type: 'negative',
            message: t('users.errors.fix_errors'),
        });
        return;
    }

    $q.loading.show();

    // Mapea el valor del select al form antes de enviar
    form.value.role_id = selectedRole.value.value;
    //Si los campos opcionales estan vacios los elimina del form para no tener problemas con graphql, aqui se deben agregar todos los campos opcionales
    if (!form.value.username) {
        delete form.value.username;  // Elimina el campo si está vacío
    }
    if (!form.value.personal_phone) {
        delete form.value.personal_phone;  // Elimina el campo si está vacío
    }


    if (isEdit.value) {
        console.log('edit data ', form.value);
        // Si edit_pass es true, eliminamos la propiedad password antes de enviar los datos
        if (!edit_pass.value) {
            delete form.value.password;
        }
        await userStore.updateUser(form.value).then(response => {
            console.log('response: ' + response)
            $q.notify({
                type: 'positive',
                message: response,
            });

        }).catch(error => {
            console.log('error catch: ' + error)
        });
        // Aquí va la lógica para editar el usuario
    } else {
        console.log('create data ', form.value);
        // Aquí va la lógica para crear el usuario
        try {
            // Enviar datos del usuario

            const newUser = await userStore.createUser(form.value);

            // Si se cargó un avatar, enviarlo
            if (userStore.new_avatar) {
                const avatarFile = new File([userStore.new_avatar], 'avatar.jpg', { type: 'image/jpeg' });
                await userStore.uploadAvatarUser(avatarFile, newUser.user_id);
            }
            $q.notify({
                type: 'positive',
                message: response,
            });
            router.push('/login');
            close();
        } catch (error) {
            console.error(error);
            $q.notify({
                type: 'negative',
                message: 'Error creating user',
            });
        }
        // await userStore.createUser(form.value).then(response => {
        //     console.log('response: ' + response)
        //     const user_id = response.user_id
        //     //recien aqui deberia guardarse el avatar
        //     // Si se cargó un avatar, enviarlo
        //     if (avatarBlob.value) {
        //         const avatarFile = new File([avatarBlob.value], 'avatar.jpg', { type: 'image/jpeg' });
        //         await userStore.uploadAvatarUser(avatarFile, newUser.user_id);
        //     }

        //     $q.notify({
        //         type: 'positive',
        //         message: response,
        //     });
        //     router.push('/login');

        // }).catch(error => {
        //     console.log('error catch: ' + error)
        // });
    }

    $q.loading.hide();
    close();
};

</script>
<style scoped>
/* Aquí puedes agregar estilos personalizados */
.input-form {
    padding: 0px 0px 4px 0px;
}

.input-bottom {
    padding: 0px 0px 20px 0px;
}
</style>
