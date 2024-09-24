<template>
    <q-layout view="hHh lpR fFf">
        <q-header>
            <q-toolbar style="height: 60px;">
                <q-btn dense flat round icon="menu" @click="drawer = !drawer" />

                <q-toolbar-title style="padding-left: 3%;" class="cursor-pointer" v-if="!$q.platform.is.mobile">
                    <q-avatar @click="redirigir">
                        <q-img :src="imageSrc" />
                    </q-avatar>
                    Glidpa IA
                </q-toolbar-title>
                <q-toolbar-title @click="redirigir" class="cursor-pointer row justify-center" v-if="$q.platform.is.mobile"
                    style="padding-left: 0%; padding-right: 10%;">
                    <q-avatar>
                        <q-img :src="imageSrc" />
                    </q-avatar>
                    Glidpa IA
                </q-toolbar-title>
                <nav class=" navbar">
                    <div class="auth-links">
                        <q-btn unelevated round icon="fa-solid fa-sun" @click="toggleTheme" />
                    </div>
                    <div class="auth-links q-pl-sm">
                        <q-btn rounded color="negative" label="SALIR" @click="handleLogout" />
                    </div>
                </nav>
            </q-toolbar>
        </q-header>
        <q-drawer v-model="drawer" show-if-above :mini="miniState" @mouseover="miniState = false"
            @mouseout="miniState = true" :width="200" :breakpoint="500" class="text-admin">
            <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
                <q-list>
                    <div v-for="(menuItem, index) in menuList" :key="index">
                        <q-item clickable v-ripple :to="menuItem.link" :class="getMenuItemClass(menuItem)">
                            <q-item-section avatar>
                                <q-icon :name="menuItem.icon" :color="getIconClass(menuItem)" />
                            </q-item-section>
                            <q-item-section :class="getTextClass(menuItem)">
                                {{ menuItem.label }}
                            </q-item-section>
                        </q-item>
                    </div>
                </q-list>
            </q-scroll-area>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import { ref, onMounted, watch } from 'vue'

const menuList = [
    {
        icon: 'fa-solid fa-chart-line',
        label: 'Dashboard',
        link: '/dashboard',
        separator: true
    },
    {
        icon: 'fa-solid fa-shop',
        label: 'Empresa',
        link: '/data',
        separator: true
    },
    {
        icon: 'fa-solid fa-robot',
        label: 'Chat bot',
        separator: false,
        link: '/chatbot',
    },
    {
        icon: 'fa-solid fa-pager',
        label: 'Landing page',
        separator: false,
        link: '/landing'
    },
    {
        icon: 'fa-solid fa-calendar-days',
        label: 'Agenda',
        separator: true,
        link: '/agenda'
    },
    {
        icon: 'fa-solid fa-comment-dots',
        label: 'Mensajes',
        separator: true,
        link: '/messages'
    },
    {
        icon: 'fa-solid fa-sliders',
        label: 'Configuración',
        separator: false,
        link: '/settings'
    }
]
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { Dark } from 'quasar'

export default {
    setup() {
        const router = useRouter();
        const route = useRoute();
        const authStore = useAuthStore();

        async function handleLogout() {
            await authStore.logout();
            router.push('/login');
        }
        const redirigir = () => {
            router.push('/');
        };
        // Estado inicial del tema basado en el localStorage o por defecto a 'light'
        const theme = ref(localStorage.getItem('theme') || 'light');
        const classPlan = ref(localStorage.getItem('class_plan'))
        const getMenuItemClass = (menuItem) => {
            const clase = 'text-' + classPlan.value
            const isActive = route.path === menuItem.link;
            const activeClass = isActive ? clase : ''; // Usa 'primary' para inactivos

            return {
                'menu-activo': isActive,
                // [activeClass]: true
            };
        };
        const getTextClass = (menuItem) => {
            const isActive = route.path === menuItem.link;
            return isActive ? `text-${classPlan.value}` : '';
        }
        const getIconClass = (menuItem) => {
            const isActive = route.path === menuItem.link;
            return isActive ? `${classPlan.value}` : '';
        }
        // Función para cambiar el tema
        const toggleTheme = () => {
            Dark.toggle();
            localStorage.setItem('theme', Dark.isActive ? 'dark' : 'light');
        };
        onMounted(() => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                Dark.set(savedTheme === 'dark');
            }
        });
        const imageSrc = ref(''); // Inicialmente vacío
        async function loadImage(color) {
            try {
                // const imagePath = `/src/assets/logo-${color}.png`;
                // const imageModule = await import(imagePath);
                const imagePath = `/assets/logo-${color}.png`;
                imageSrc.value = imagePath;

                // imageSrc.value = imageModule.default;
            } catch (e) {
                console.error("Error al cargar la imagen:", e);
                // Maneja el error según sea necesario
            }
        }
        watch(classPlan, (newValue) => {
            loadImage(newValue);
        });
        loadImage(classPlan.value);
        return {
            drawer: ref(false),
            miniState: ref(true),
            menuList,
            toggleLeftDrawer() {
                drawer.value = !drawer.value
            },
            redirigir,
            handleLogout,
            theme,
            toggleTheme,
            classPlan,
            getIconClass,
            getTextClass,
            getMenuItemClass,
            imageSrc
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
}



.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-links {
    display: flex;
    gap: 1rem;
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
