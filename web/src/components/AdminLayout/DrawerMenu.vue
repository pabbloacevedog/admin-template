<template>
    <q-drawer v-model="localModel" show-if-above :width="240">
        <q-scroll-area class="fit">
            <q-list padding>
                <div class="q-pa-sm">
                    <div class="row justify-center items-center column q-pb-sm ">
                        <q-img :src="logoUrl" spinner-color="red" class="img-logo"/>
                    </div>
                    <q-item v-for="link in menu.links1" :key="link.text" v-ripple clickable :to="link.href"
                        class="item-drawer-user q-my-sm">
                        <q-item-section avatar class="icon-section-drawer-user">
                            <q-icon :name="link.icon" />
                        </q-item-section>
                        <q-item-section class="text-section-drawer-user">
                            <q-item-label>{{ link.text }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item-label header class="text-weight-bold text-uppercase q-mt-md q-mb-xs text-theme">
                        Settings Admin
                    </q-item-label>

                    <q-item v-for="link in menu.links3" :key="link.text" v-ripple clickable :to="link.href"
                        class="item-drawer-user q-my-sm">
                        <q-item-section avatar class="icon-section-drawer-user">
                            <q-icon :name="link.icon" />
                        </q-item-section>
                        <q-item-section class="text-section-drawer-user">
                            <q-item-label>{{ link.text }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </div>
            </q-list>
        </q-scroll-area>
    </q-drawer>
</template>

<script setup>
import { ref } from 'vue';
// Recibimos el valor del v-model como prop
const props = defineProps({
    leftDrawerOpen: Boolean, // El valor vinculado al v-model, en este caso un booleano para abrir/cerrar el drawer
});
import logoUrl from 'src/assets/logo.webp';
// Definimos una variable local para manejar el valor del v-model
const localModel = ref(props.modelValue);
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
        { icon: 'manage_accounts', text: 'Account Settings', href: '/admin/settings' }
    ],
})
</script>

<style lang="css">
.item-drawer-user {
    border-radius: 10px;
    min-height: 35px !important;
}

.text-section-drawer-user {
    font-size: 14px !important;
    font-weight: bold;
}

.icon-section-drawer-user {
    padding: 6px 0px !important;
    min-width: 35px !important;
}
.img-logo{
    height: 100px;
    max-width: 200px;
    border-radius:10px;
}
</style>
