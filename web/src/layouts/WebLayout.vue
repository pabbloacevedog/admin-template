<template>
    <q-layout view="hHh lpR fff">

        <q-header>
            <q-toolbar class="bg-black text-white">
                <q-btn dense flat round icon="menu" @click="drawer = !drawer" v-if="$q.platform.is.mobile" />

                <q-toolbar-title @click="redirigir" style="padding-left: 3%;" class="cursor-pointer" v-if="!$q.platform.is.mobile" >
                    <q-avatar>
                        <!-- <img src="@/assets/logo.png"> -->
                    </q-avatar>
                    Empresa
                </q-toolbar-title>
                <q-toolbar-title @click="redirigir" class="cursor-pointer row justify-center" v-if="$q.platform.is.mobile" style="padding-left: 0%; padding-right: 10%;">
                    <q-avatar>
                        <!-- <img src="@/assets/logo.png"> -->
                    </q-avatar>
                    Empresa
                </q-toolbar-title>
                <nav class=" navbar" v-if="!$q.platform.is.mobile">
                    <div class="nav-links">
                        <a href="#pricing" class="nav-link texto-primary">Planes</a>
                        <a href="#about-us" class="nav-link texto-primary">Sobre Nosotros</a>
                        <a href="#contact" class="nav-link texto-primary">Contacto</a>
                    </div>
                    <!-- <div class="auth-links" v-if="authStore.isLoggedIn">
                        <q-btn to="/dahsboard" rounded color="primary" label="Dahsboard" />
                    </div>
                    <div class="auth-links" v-else>
                        <q-btn to="/login" outline rounded color="primary" label="Iniciar Sesión" />
                        <q-btn to="/signup" rounded color="primary" label="Únete" style="padding: 0 30px;" />
                    </div> -->
                </nav>
            </q-toolbar>
        </q-header>
        <q-drawer v-model="drawer" :width="200" :breakpoint="500" overlay side="left" class="bg-black text-white">
            <q-scroll-area class="fit">
                <q-list>
                    <div v-for="(menuItem, index) in menuList" :key="index">
                        <q-item clickable :active="menuItem.label === 'Outbox'" v-ripple>
                            <q-item-section class="texto-primary">
                                <a :href="menuItem.link" class="bg-primary texto-primary">{{ menuItem.label }}</a>

                            </q-item-section>
                        </q-item>
                        <q-separator :key="'sep' + index" v-if="menuItem.separator" />
                    </div>
                    <q-item>
                        <q-btn outline rounded color="primary" label="Iniciar Sesión" />
                    </q-item>
                    <q-separator />
                    <q-item>
                        <q-btn rounded color="primary" label="Únete" style="padding: 0 30px;" />
                    </q-item>
                    <q-separator />
                </q-list>
            </q-scroll-area>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import { ref } from 'vue'

const menuList = [
    {
        icon: 'price_change',
        label: 'Precios',
        link: '#pricing',
        separator: true
    },
    {
        icon: 'favorite',
        label: 'Sobre nososotros',
        separator: false,
        link: '#about-us',
    },
    {
        icon: 'phone',
        label: 'Contacto',
        separator: true,
        link: '#contact'
    }
]
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
export default {
    setup() {
        const router = useRouter();
        const authStore = useAuthStore();
        const redirigir = () => {
            router.push('/');
        };
        return {
            drawer: ref(false),
            menuList,
            toggleLeftDrawer() {
                drawer.value = !drawer.value
            },
            redirigir,
            authStore
        }
    }
}
</script>
<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #000;
    color: #fff;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-links {
    display: flex;
    gap: 1rem;
}

.nav-link {
    color: #fff;
    text-decoration: none;
    padding: 0.5rem 1rem;
    transition: color 0.3s ease;
}

.nav-link:hover {
    color: #aaa;
}

.auth-links {
    display: flex;
    gap: 0.5rem;
}

.btn-login,
.btn-signup {
    padding: 0.5rem 1rem;
    border: none;
    background-color: #222;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-login:hover {
    background-color: #333;
}

.btn-signup {
    background-color: #fff;
    color: #000;
    border-radius: 20px;
}

.btn-signup:hover {
    background-color: #e6e6e6;
}
</style>
