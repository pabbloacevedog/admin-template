<template>
    <q-dialog v-model="userStore.show_modal_user" @hide="resetForm" backdrop-filter="blur(4px) saturate(150%)"
        class="container-modal" :fullscreen="isMobile" transition-show="none" transition-hide="none">
        <div class="q-py-lg form-modal-view div-blur div-rounded-radius h-form" :style="dialogStyle">
            <q-card flat
                style="flex-grow: 1; display: flex; flex-direction: column;  background: #00000000 !important;">
                <q-card-header>
                    <q-toolbar class="div-rounded-radius">
                        <q-toolbar-title>
                            <SubTitleSettingsPanel
                                :subtitle="isEdit ? $t('users.edit.title') : $t('users.create.title')"
                                :description="isEdit ? $t('users.edit.description') : $t('users.create.description')"
                                :icon="isEdit ? 'supervisor_account' : 'person_add'" />
                        </q-toolbar-title>
                        <q-btn round flat icon="close" @click="close" />
                    </q-toolbar>
                </q-card-header>
                <q-card-section horizontal class="q-pt-none">
                    <q-card-section class="col-5 q-pl-none q-pr-xs">
                        <InputTitleModal :title="$t('users.account.avatar.title')"
                            :description="$t('users.account.avatar.description')" style="height:100px !important;" />
                        <InputTitleModal :title="$t('users.account.name.title')"
                            :description="$t('users.account.name.description')" class="q-mt-md q-mb-none" />
                        <InputTitleModal :title="$t('users.account.username.title')"
                            :description="$t('users.account.username.description')" />
                        <InputTitleModal :title="$t('users.account.email.title')"
                            :description="$t('users.account.email.description')" />
                        <InputTitleModal :title="$t('users.account.password.title')"
                            :description="$t('users.account.password.description')" />
                        <InputTitleModal :title="$t('users.account.personal_phone.title')"
                            :description="$t('users.account.personal_phone.description')" />
                        <InputTitleModal v-if="isEdit" :title="$t('users.account.verified.title')"
                            :description="$t('users.account.verified.description')" />
                        <InputTitleModal v-if="isEdit" :title="$t('users.account.state.title')"
                            :description="$t('users.account.state.description')" />
                        <InputTitleModal :title="$t('users.account.role.title')"
                            :description="$t('users.account.role.description')" />
                        <!-- <InputTitleModal :title="$t('users.account.rut_user.title')"
                            :description="$t('users.account.rut_user.description')" /> -->
                    </q-card-section>

                    <q-card-section class="col-7 q-pr-none q-pl-xs">
                        <UpdateAvatarUploader :size_avatar="'100px'" :user="user" v-if="isEdit" />
                        <NewAvatarUploader :size_avatar="'100px'" :user="user" v-else />
                        <q-input :dense="isMobile" class="q-mt-md q-mb-none" filled v-model="form.name"
                            :label="$t('users.account.name.title')" type="text" autocomplete="name" :error="errors.name"
                            :error-message="errors.nameMsg" />
                        <q-input :dense="isMobile" class="input-form" filled v-model="form.username"
                            :label="$t('users.account.username.title')" type="text" />
                        <q-input :dense="isMobile" class="q-mb-none q-mt-md" filled v-model="form.email"
                            :label="$t('users.account.email.title')" type="email" autocomplete="email"
                            :error="errors.email" :error-message="errors.emailMsg" />
                        <div v-if="isEdit" class="flex justify-end input-bottom">
                            <q-btn icon="arrow_back" v-if="!edit_pass" outline color="primary"
                                class="btn-border-radius q-mr-md btn-password-back" @click="edit_pass = !edit_pass" />
                            <q-btn :dense="isMobile" label="Edit password" icon="lock" icon-right="lock_open"
                                v-if="edit_pass" outline color="primary"
                                class="btn-border-radius q-my-none btn-password-edit" @click="edit_pass = !edit_pass" />
                            <q-input :dense="isMobile" v-else v-model="form.password" filled
                                :type="isPwd ? 'password' : 'text'" :label="$t('users.account.password.title')"
                                :error="errors.password" :error-message="errors.passwordMsg"
                                class="input-password-edit">
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                        @click="isPwd = !isPwd" />
                                </template>
                            </q-input>
                        </div>
                        <div v-else class="q-my-none">
                            <q-input :dense="isMobile" v-model="form.password" filled
                                :type="isPwd ? 'password' : 'text'" :label="$t('users.account.password.title')"
                                :error="errors.password" :error-message="errors.passwordMsg">
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                        @click="isPwd = !isPwd" />
                                </template>
                            </q-input>
                        </div>

                        <q-input :dense="isMobile" class="input-bottom" filled v-model="form.personal_phone"
                            :label="$t('Phone: (###) ### - ####')" type="tel" mask="(###) ### - ####" />
                        <div class="btn-verified-edit input-bottom" v-if="isEdit">
                            <q-item class="q-pa-none" v-if="form.verified">
                                <q-item-section avatar class="q-pa-none">
                                    <q-avatar>
                                        <q-icon name="verified" class="text-verified" size="36px" />
                                    </q-avatar>
                                </q-item-section>
                                <q-item-section class="q-pa-none">
                                    <q-item-label class="text-weight-bold">{{ $t('users.account.verified.title')
                                        }}</q-item-label>
                                </q-item-section>
                            </q-item>
                            <q-item class="q-pa-none" v-else>
                                <q-item-section avatar class="q-pa-none">
                                    <q-avatar>
                                        <q-icon name="verified" color="second" size="36px" />
                                    </q-avatar>
                                </q-item-section>
                                <q-item-section class="q-pa-none">
                                    <q-item-label class="text-weight-bold">No
                                        {{ $t('users.account.verified.title') }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </div>
                        <div class="btn-verified-edit input-bottom" v-if="isEdit">
                            <q-toggle size="lg" v-model="form.state" color="green"
                                :label="form.state ? 'Active' : 'Inactive'" />
                        </div>
                        <!-- q-select para los roles -->
                        <q-select :dense="isMobile" filled v-model="selectedRole" :options="roles" option-label="label"
                            option-value="value" :label="$t('users.account.role.title')"
                            :class="'select-role bg-' + selectedRole.color">
                        </q-select>
                        <!-- <q-input class="input-bottom" filled v-model="form.rut_user"
                            :label="$t('users.account.rut_user.title')" /> -->
                    </q-card-section>

                </q-card-section>
            </q-card>

            <!-- Botones en posición fija usando q-page-sticky -->
            <!-- <q-page-sticky position="bottom" :offset="[0, 36]" class="q-mb-md" v-if="isMobile"> -->
            <div class="flex justify-center q-pt-lg" v-if="isMobile">
                <q-btn :label="$t('users.create.btn_cancel')" outline color="primary" class="btn-border-radius q-mr-lg"
                    @click="close" />
                <q-btn :label="isEdit ? $t('users.edit.btn_action') : $t('users.create.btn_action')" color="primary"
                    class="btn-border-radius" @click="submit" />
            </div>
            <!-- </q-page-sticky> -->
            <div class="flex justify-center q-pb-lg" v-else>
                <q-btn :label="$t('users.create.btn_cancel')" outline color="primary" class="btn-border-radius q-mr-lg"
                    @click="close" />
                <q-btn :label="isEdit ? $t('users.edit.btn_action') : $t('users.create.btn_action')" color="primary"
                    class="btn-border-radius" @click="submit" />
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import SubTitleSettingsPanel from 'components/AccountUser/SubTitleSettingsPanel.vue';
import InputTitleModal from '../General/InputTitleModal.vue';
import NewAvatarUploader from './NewAvatarUploader.vue';
import UpdateAvatarUploader from './UpdateAvatarUploader.vue';
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
const selectedRole = ref(
    {
        label: 'admin',    // Lo que se muestra en el select
        value: 2,  // El valor que se selecciona (role_id)
        color: 'admin',
    }

); // nuevo ref para el select
const user = ref(props.user);
const form = ref({
    user_id: '',
    name: '',
    username: '',
    email: '',
    personal_phone: '',
    password: '',
    state: true,
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

// Detectar si es móvil
const isMobile = computed(() => {
    return window.innerWidth <= 600; // Define tu umbral para mobile aquí
});

// Estilo de dialog
const dialogStyle = computed(() => {
    return isMobile.value ? 'width: 100vw; max-width: 100vw; max-height: 100vh !important;height: 98vh;margin: 8px;' : 'width: 800px; max-width: 100vw;';
});

// Cargar roles y preparar el formulario al montar
onMounted(async () => {
    try {
        fetchRoles();
        if (user.value && user.value.role_id) {
            form.value = { ...user.value };
            selectedRole.value = {
                label: user.value.role.title,
                value: Number(user.value.role.role_id),
            }

            isEdit.value = true;
        } else {
            resetForm();
            isEdit.value = false;
        }

    } catch (error) {
        console.error('Error fetching user:', error);
    }
});
// Cargar los roles desde la store
const fetchRoles = async () => {
    const result = await roleStore.getRoles();
    roles.value = result.map(role => ({
        label: role.title,    // Lo que se muestra en el select
        value: Number(role.role_id),  // El valor que se selecciona (role_id)
        color: role.color,
    }));
    if (user.value) {
        selectedRole.value.color = roles.value.find(r => r.value === Number(user.value.role.role_id)).color;
    }
    else{

        selectedRole.value = roles.value.find(r => r.value === Number(1));
        console.log('selectedRole', selectedRole.value)
    }
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
        // Si edit_pass es true, eliminamos la propiedad password antes de enviar los datos, significa que la password no fue
        if (edit_pass.value) {
            delete form.value.password;
        }
        // Eliminamos el role, avatar, verified y el __typename para que sea igual al input que espera graphql
        delete form.value.role;
        delete form.value.owner_id;
        delete form.value.avatar;
        delete form.value.verified;
        delete form.value.__typename;
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
            // Enviar datos del usuario, todos los usuarios nuevos estan activos por defecto
            form.value.state = true
            const newUser = await userStore.createUser(form.value);

            // Si se cargó un avatar, enviarlo
            if (userStore.new_avatar) {
                const avatarFile = new File([userStore.new_avatar], 'avatar.jpg', { type: 'image/jpeg' });
                await userStore.uploadAvatarUser(avatarFile, newUser.user_id);
            }
            $q.notify({
                type: 'positive',
                message: newUser.message,
            });
            close();
        } catch (error) {
            console.error(error);
        }
    }

    $q.loading.hide();
    close();
};

</script>
<script>
export default {
    name: 'UserFormModal',
}
</script>
<style scoped>
/* Aquí puedes agregar estilos personalizados */
.input-form {
    padding: 0px 0px 4px 0px;
}

.input-bottom {
    padding: 0px 0px 20px 0px;
}

@media (max-width: 855px) {

    .form-modal {
        padding: 24px 24px;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .btn-password-edit {
        height: 40px !important;
        width: 100%;
        font-size: 12px;
    }

    .btn-verified-edit {
        height: 60px !important;
        width: 100%;
    }

    .input-password-edit {
        width: 75%;
        padding: 0px;
    }

    .btn-password-back {
        padding: 0px 8px;
        margin-right: 8px;
    }
}

/* Estilo para pantallas pequeñas: ratio libre */
@media (min-width: 855px) {
    .form-modal {
        padding: 16px 48px;

    }

    .btn-password-edit {
        height: 56px !important;
        width: 100%;
    }

    .btn-verified-edit {
        height: 76px !important;
        width: 100%;
    }

    .input-password-edit {
        width: 82%;
        padding: 0px;
    }

    .btn-password-back {
        padding: 0px 20px;
        margin-right: 8px;
    }
}
</style>
