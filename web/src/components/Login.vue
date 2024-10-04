<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <q-page class="login-page">
        <div class="login-container row justify-center items-center">
            <!-- Columna izquierda: Imagen -->
            <div class="col-xl-6 col-md-6 col-xs-12 col-sm-12 q-pa-xs full-height">
                <q-img src="https://picsum.photos/500/300" style="border-radius: 15px;" class="img-login full-height"
                    fit="cover" />
            </div>
            <!-- Columna derecha: Formulario -->
            <div class="col-xl-6 col-md-6 col-xs-12 col-sm-12 q-px-lg">
                <div class="form-container form-login">
                    <div v-if="!clickUserRemember">
                        <div class="text-h4 text-center q-my-lg">{{ $t('login.title') }}</div>
                        <div class="text-h6 text-second text-center q-ma-lg">{{ $t('login.description') }}</div>
                    </div>
                    <div v-else class="q-pt-lg ">
                        <div class="row justify-center items-center column">
                            <q-avatar size="100px">
                                <img :src="reus_selected.avatar">
                            </q-avatar>
                            <div class="text-h4 text-center q-mt-md q-mb-xs">{{ reus_selected.name }}</div>
                            <div class="text-h6 text-second text-center q-my-sm">{{ reus_selected.email }}</div>
                        </div>
                        <q-form @submit="onSubmit" autocomplete="on">
                            <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'"
                                :label="$t('login.password')" autocomplete="new-password" :error="errors.password"
                                :error-message="errors.passwordMsg" class="q-mb-md">
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                        @click="isPwd = !isPwd" />
                                </template>
                            </q-input>
                            <q-btn :label="$t('login.btn_login')" type="submit" color="primary"
                                class="full-width q-mb-md btn-border-radius" />
                        </q-form>
                    </div>
                    <div v-if="isRemember" class="justify-center  q-mb-md">
                        <div v-if="!clickUserRemember" class="remembered-users-container">
                            <div v-for="(reus, index) in rememberedUsers" :key="index" class="q-mb-lg ">
                                <q-card class="cursor-pointer card-remember-user" flat bordered
                                    @click="selectRememberUser(reus)">
                                    <q-item>
                                        <q-item-section avatar>
                                            <q-avatar>
                                                <img :src="reus.avatar">
                                            </q-avatar>
                                        </q-item-section>

                                        <q-item-section>
                                            <q-item-label>{{ reus.name }}</q-item-label>
                                            <q-item-label caption>
                                                {{ reus.email }}
                                            </q-item-label>
                                        </q-item-section>
                                        <q-item-section side>
                                            <q-btn flat round icon="close" @click.stop="removeRememberUser(reus.email)"
                                                color="negative" />
                                        </q-item-section>
                                    </q-item>
                                </q-card>
                            </div>
                        </div>
                        <div class="row justify-center q-mb-md">
                            <q-btn flat :label="$t('login.select_different_user')" class="text-primary justify-center"
                                @click="selectDifferentUser()" />
                        </div>
                    </div>
                    <div v-else>
                        <q-form @submit="onSubmit" autocomplete="on">
                            <q-input v-model="email" :label="$t('login.email')" type="email" filled class="q-mb-md"
                                autocomplete="email" :error="errors.email" :error-message="errors.emailMsg" />
                            <q-input v-model="password" filled :type="isPwd ? 'password' : 'text'"
                                :label="$t('login.password')" autocomplete="new-password" :error="errors.password"
                                :error-message="errors.passwordMsg" class="q-mb-md">
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                        @click="isPwd = !isPwd" />
                                </template>
                            </q-input>
                            <div class="row justify-center" style="min-height: 40px;">
                                <q-avatar v-for="(rs, n) in rememberedUsers" :key="n" size="40px"
                                    class="overlapping cursor-pointer" @click="selectRememberedUsers()"
                                    :style="`margin-left: ${n * 55}px`">
                                    <img :src="rs.avatar">
                                </q-avatar>
                            </div>
                            <div class="q-pt-md q-pb-sm row justify-center">
                                <q-btn flat :label="$t('login.forgot_password')" class="text-primary"
                                    @click="router.push('/forgot_password')" />
                            </div>
                            <q-btn :label="$t('login.btn_login')" type="submit" color="primary"
                                class="full-width q-mb-md btn-border-radius" />

                            <div class="row justify-center q-mb-md">
                                <p>{{ $t('login.new_user') }} <q-btn flat :label="$t('login.sign_up')"
                                        class="text-primary" @click="router.push('/register')" /></p>
                            </div>

                        </q-form>
                    </div>


                </div>
            </div>
        </div>
    </q-page>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'stores/auth';
import { useI18n } from 'vue-i18n';  // Importar useI18n
// Obtener $t desde useI18n
const { t } = useI18n();
const email = ref('');
const password = ref('');
const rememberedUser = ref(null); // Usuario recordado seleccionado
const rememberedUsers = ref([]); // Arreglo de usuarios recordados
const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();
const isPwd = ref(true);
const isRemember = ref(false);
const clickUserRemember = ref(false);
const errors = ref({
    password: false,
    passwordMsg: '',
    email: false,
    emailMsg: '',
});
const reus_selected = ref({
    name: '',
    avatar: '',
    email: '',
});

// Validación de contraseñas
const validateForm = () => {
    let isValid = true;
    // Validar el email (formato válido)
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!email.value) {
        errors.value.email = true;
        errors.value.emailMsg = t('login.errors.email_required');
        isValid = false;
    } else if (!emailPattern.test(email.value)) {
        errors.value.email = true;
        errors.value.emailMsg = t('login.errors.email_invalid');
        isValid = false;
    } else {
        errors.value.email = false;
        errors.value.emailMsg = '';
    }

    // Validar la contraseña (al menos 6 caracteres, una mayúscula y un número)
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!password.value) {
        errors.value.password = true;
        errors.value.passwordMsg = t('login.errors.password_required');
        isValid = false;
    }
    // else if (!passwordPattern.test(password.value)) {
    //     errors.value.password = true;
    //     errors.value.passwordMsg = t('login.errors.password_invalid');
    //     isValid = false;
    // }
    else {
        errors.value.password = false;
        errors.value.passwordMsg = '';
    }
    return isValid;
};
const onSubmit = async () => {

    if (!validateForm()) {
        $q.notify({
            type: 'negative',
            message: t('login.errors.fix_errors'),
        });
        return;
    }
    $q.loading.show()
    try {
        const user = await authStore.login({ email: email.value, password: password.value });
        // Guardar usuario en localStorage
        console.log(user, 'userlogin')
        const userData = { email: user.email, avatar: user.avatar, name: user.name };
        saveUserInLocalStorage(userData);
        $q.notify({
            type: 'positive',
            message: `Bienvenido ${user.name}`
        });
        router.push('/admin');
    } catch (error) {
        console.log('error catch: ' + error)
        // Error handling is already done in the store, no need to do anything here
    }
    $q.loading.hide()
};
// Guardar el usuario en localStorage
const saveUserInLocalStorage = (user) => {
    let users = JSON.parse(localStorage.getItem('rememberedUsers')) || [];
    if (!users.some(u => u.email === user.email)) {
        users.push(user);
        localStorage.setItem('rememberedUsers', JSON.stringify(users));
    }
};

// Cargar usuarios recordados desde localStorage
const loadRememberedUsers = () => {
    rememberedUsers.value = JSON.parse(localStorage.getItem('rememberedUsers')) || [];
    if (rememberedUsers.value.length > 0) {
        rememberedUser.value = rememberedUsers.value[0]; // Seleccionar el primer usuario recordado
        isRemember.value = true;
    }
};
//Elimina el email de los recordados
const removeRememberUser = (email) => {
    let users = JSON.parse(localStorage.getItem('rememberedUsers')) || [];
    users = users.filter(u => u.email !== email); // Eliminar usuario por email
    localStorage.setItem('rememberedUsers', JSON.stringify(users));
    rememberedUsers.value = users; // Actualizar la lista en la vista
};
// Permitir seleccionar un usuario diferente
const selectDifferentUser = () => {
    isRemember.value = false;
    clickUserRemember.value = false;
    email.value = '';
};
const selectRememberedUsers = () => {
    isRemember.value = true;
};
const selectRememberUser = (selected) => {
    reus_selected.value = selected
    email.value = selected.email;
    clickUserRemember.value = true;
    isRemember.value = true;
};
onMounted(() => {
    loadRememberedUsers();
    authStore.clearError();
});
</script>

<style scoped>
.login-page {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background: url('https://picsum.photos/1200/800') no-repeat center center;
    background-size: cover;
}

.login-container {
    width: 80%;
    max-width: 1200px;
    background: #ffffff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    overflow: hidden;
}

.left-section,
.right-section {
    min-width: 50%;
}

.form-container {
    width: 100%;
    margin: 0 auto;
}

.separator {
    text-align: center;
    margin: 20px 0;
}

.separator span {
    display: inline-block;
    background: #fff;
    padding: 0 10px;
    position: relative;
    z-index: 1;
}

.separator:before {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background: #ccc;
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 0;
}

.full-width {
    width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .login-container {
        flex-direction: column;
        margin-top: 0px;
        width: 95%;
    }

    .left-section,
    .right-section {
        min-width: 100%;
        flex: none;
    }
}

.overlapping {
    border: 2px solid white;
    position: absolute;
}

.card-remember-user {
    border-radius: 10px;
}

.content {
    position: relative;
    /* Asegura que el contenedor tenga el contexto para los hijos */
    width: 100%;
    /* Ocupa el 100% del ancho del div padre */
    height: 100%;
    /* Ocupa el 100% de la altura del div padre */
    overflow: hidden;
    /* Esconde cualquier contenido que se desborde */
}

.remembered-users-container {
    max-height: 380px;
    /* Ajusta la altura máxima según lo que necesites */
    overflow-y: auto;
    /* Habilita el scroll vertical */
}

.full-size {
    position: absolute;
    /* Para que la imagen se posicione respecto a su contenedor */
    top: 0;
    /* Alinea al inicio del contenedor */
    left: 0;
    /* Alinea al inicio del contenedor */
    width: 100%;
    /* Ocupa el 100% del ancho */
    height: 100%;
    /* Ocupa el 100% de la altura */
    object-fit: cover;
    /* Mantiene la relación de aspecto y recorta si es necesario */
}

.full-height {
    height: 100%;
    /* Se asegura de que el div ocupe todo el alto disponible */
}

.img-login {
    width: 100%;
    /* La imagen se ajusta al ancho del contenedor */
    height: 100%;
    /* La imagen se ajusta al alto del contenedor */
    object-fit: cover;
    /* Mantiene la relación de aspecto y recorta si es necesario */
}

/* Estilo para pantallas grandes: ratio de 1 */
@media (min-width: 856px) {
    .img-login {
        aspect-ratio: 1;
        /* Mantiene una proporción 1:1 en pantallas grandes */
    }
}

/* Estilo para pantallas pequeñas: ratio libre */
@media (max-width: 855px) {
    .img-login {
        aspect-ratio: auto;
        /* Ratio libre en pantallas móviles */
    }

    .form-login {
        padding: 16px 16px;
    }
}

/* Estilo para pantallas pequeñas: ratio libre */
@media (min-width: 855px) {


    .form-login {
        padding: 16px 48px;
    }
}
</style>
