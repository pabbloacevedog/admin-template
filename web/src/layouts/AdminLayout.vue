<template>
    <q-layout class="bg-grey-1 text-black dark:bg-grey-9 dark:text-white">
        <q-header class="text-white">
            <q-toolbar class="q-py-sm q-px-md">
                <q-btn flat round @click="toggleLeftDrawer" aria-label="Menu" icon="menu" />
                <q-space />

                <div class="q-pl-sm q-gutter-sm row items-center no-wrap">
                    <q-btn v-if="$q.screen.gt.xs" flat round size="md" icon="notifications"
                        class="q-mr-md btn-round-radius btn-toolbar" />
                    <q-btn round class="btn-toolbar" v-if="$q.platform.is.mobile">
                        <q-avatar size="43px">
                            <img :src="user?.avatar">
                        </q-avatar>
                        <q-menu auto-close style="border-radius: 15px;min-width: 12vw !important;" class="no-shadow">
                            <q-list>
                                <q-item clickable @click="goUserSettings">
                                    <q-item-section avatar>
                                        <q-icon name="settings" size="25px" />
                                    </q-item-section>
                                    <q-item-section>
                                        Account settings
                                    </q-item-section>
                                </q-item>
                                <q-item clickable @click="goUserSettings">
                                    <q-item-section avatar>
                                        <q-icon name="mail_outline" size="25px" />
                                    </q-item-section>
                                    <q-item-section>
                                        Messages
                                    </q-item-section>
                                </q-item>
                                <q-separator />
                                <q-item clickable class="q-py-xs" @click="logOut">
                                    <q-item-section avatar>
                                        <q-icon name="logout" size="25px" />
                                    </q-item-section>
                                    <q-item-section>Sign out</q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                    <q-btn rounded flat size="md" class="btn-user btn-toolbar" v-else>
                        <q-item class="q-pa-none">
                            <q-item-section avatar class="q-pa-none">
                                <q-avatar size="43px">
                                    <img :src="authStore.user?.avatar">
                                </q-avatar>
                            </q-item-section>

                            <q-item-section class="q-pa-none">
                                <q-item-label>{{ authStore.user?.name }}</q-item-label>
                                <q-item-label caption style="font-size: 10px;">
                                    {{ authStore.user?.email }}
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-menu auto-close style="border-radius: 15px;min-width: 12vw !important;" class="no-shadow">
                            <q-list>
                                <q-item clickable @click="goUserSettings">
                                    <q-item-section avatar>
                                        <q-icon name="settings" size="25px" />
                                    </q-item-section>
                                    <q-item-section>
                                        Account settings
                                    </q-item-section>
                                </q-item>
                                <q-item clickable @click="goUserSettings">
                                    <q-item-section avatar>
                                        <q-icon name="mail_outline" size="25px" />
                                    </q-item-section>
                                    <q-item-section>
                                        Messages
                                    </q-item-section>
                                </q-item>
                                <q-separator />
                                <q-item clickable class="q-py-xs" @click="logOut">
                                    <q-item-section avatar>
                                        <q-icon name="logout" size="25px" />
                                    </q-item-section>
                                    <q-item-section>Sign out</q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </div>
            </q-toolbar>
        </q-header>
        <q-drawer v-model="leftDrawerOpen" show-if-above :width="200">
            <q-scroll-area class="fit">
                <q-list padding>
                    <q-item v-for="link in menu.links1" :key="link.text" v-ripple clickable :to="link.href">
                        <q-item-section avatar>
                            <q-icon color="grey" :name="link.icon" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label class="text-grey">{{ link.text }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-separator class="q-mt-md q-mb-xs" />

                    <q-item-label header class="text-weight-bold text-uppercase">
                        Settings
                    </q-item-label>

                    <q-item v-for="link in menu.links3" :key="link.text" v-ripple clickable>
                        <q-item-section avatar>
                            <q-icon color="grey" :name="link.icon" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label class="text-grey">{{ link.text }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-scroll-area>
        </q-drawer>
        <q-page-container class="page-background">
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useQuasar, Dark } from 'quasar';
import { useRouter } from 'vue-router';

import { useI18n } from 'vue-i18n';  // Importar useI18n

// Obtener $t desde useI18n
const { t } = useI18n();
const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();
var user = ref(null);
// Estado para el tema oscuro
const isDarkTheme = ref(Dark.isActive);
const leftDrawerOpen = ref(false)
const menu = ref({
    links1: [
        { icon: 'dashboard', text: 'Dashboard', href: '/admin' },
        { icon: 'whatshot', text: 'Trending' },
        { icon: 'subscriptions', text: 'Subscriptions' }
    ],
    links2: [
        { icon: 'folder', text: 'Library' },
        { icon: 'restore', text: 'History' },
        { icon: 'watch_later', text: 'Watch later' },
        { icon: 'thumb_up_alt', text: 'Liked videos' }
    ],
    links3: [
        { icon: 'camera', text: 'YouTube Premium' },
        { icon: 'local_movies', text: 'Movies & Shows' },
        { icon: 'videogame_asset', text: 'Gaming' },
        { icon: 'live_tv', text: 'Live' }
    ],
})
const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
}
const goUserSettings = () => {
    router.push('/admin/settings');
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
        console.log('response: ' + response)
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
    name: 'SettingsUser',
}
</script>

<style lang="css">
.btn-user {
    padding: 0px 20px 0px 3px !important;
    font-size: 12px !important;
}
</style>
