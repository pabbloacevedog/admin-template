<template>
    <q-layout class="text-theme" view="lHh lpR lff">
        <q-header class="text-theme">
            <q-toolbar class="q-py-sm q-pl-md q-pr-none">
                <q-btn flat round @click="toggleLeftDrawer" aria-label="Menu" icon="menu" />
                <q-space />
                <div class="btn-user-padding row items-center no-wrap">
                    <BtnNotifyToolbar/>
                    <BtnMobileUserToolbar :goUserSettings="goUserSettings" :goUserMessages="goUserMessages" :logOut="logOut" v-if="$q.platform.is.mobile"/>
                    <BtnUserToolbar :goUserSettings="goUserSettings" :goUserMessages="goUserMessages" :logOut="logOut" v-else/>
                </div>
            </q-toolbar>
        </q-header>
        <DrawerMenu v-model="leftDrawerOpen" />
        <q-page-container class="page-background">
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from 'stores/auth';
import { useQuasar, Dark } from 'quasar';
import { useRouter } from 'vue-router';

import { useI18n } from 'vue-i18n';  // Importar useI18n

//Components
import BtnUserToolbar from 'components/AdminLayout/BtnUserToolbar.vue';
import BtnNotifyToolbar from 'components/AdminLayout/BtnNotifyToolbar.vue';
import BtnMobileUserToolbar from 'components/AdminLayout/BtnMobileUserToolbar.vue';
import DrawerMenu from 'components/AdminLayout/DrawerMenu.vue';
// Obtener $t desde useI18n
const { t } = useI18n();
const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
var user = ref(null);
// Estado para el tema oscuro
const isDarkTheme = ref(Dark.isActive);
const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
}
const goUserSettings = () => {
    router.push('/admin/account');
}
const goUserMessages = () => {
    console.log('goUserMessages')
}
const updateUserInLocalStorage = (updatedUser) => {
    let users = JSON.parse(localStorage.getItem('rememberedUsers')) || [];
    users = users.map(user =>
        user.email === updatedUser.email ? { ...user, ...updatedUser } : user
    );
    localStorage.setItem('rememberedUsers', JSON.stringify(users));
};
const logOut = async () => {
    $q.loading.show()
    updateUserInLocalStorage({
        email: user.value.email,
        name: user.value.name,
        avatar: user.value.avatar
    });
    await authStore.logOut().then(response => {
        $q.notify({
            type: 'positive',
            message: response,
        });
        Dark.set(false); // Cambiar el tema a claro al logout
        router.push('/login');

    }).catch(error => {
        console.log('error catch: ' + error)
    });
    $q.loading.hide()
};
onMounted(async () => {
    try {
        const fetchedUser = await authStore.userSettings(authStore.user.user_id);
        user.value = fetchedUser;
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

</script>
<script>
export default {
    name: 'AdminLayout',
}
</script>

<style lang="css">
.btn-user {
    padding: 0px 20px 0px 0px !important;
    font-size: 10px !important;
}

.menu-user-top {
    border-radius: 10px;
    margin-top: 5px !important;
}

.item-user {
    padding: 0px 0px 0px 3px !important;
    font-size: 13px !important;
    max-height: 42px !important;
    min-height: 42px !important;
}
.item-menu-user{
    border-radius: 10px;
    padding: 0px 6px !important;
    padding-right: 15px !important;
    min-height: 35px !important;
}
.text-section-menu-user{
    font-size: 12px !important;
    font-weight: bold;
}
.icon-section-menu-user{
    padding: 6px 0px !important;

    min-width: 35px !important;
}
.btn-user-padding {
    padding: 0px 48px !important;
}

@media (max-width: 768px) {
    .btn-user-padding {
        padding: 0px 8px !important;
    }
}
</style>
