<template>
	<q-page-container>
		<router-view />
	</q-page-container>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export default defineComponent({
    name: 'MainLayout',

    setup() {
        const leftDrawerOpen = ref(false);
        const router = useRouter();
        const route = useRoute();
        const authStore = useAuthStore();

        const isAuthenticated = computed(() => !!authStore.token);
        const isAuthRoute = computed(() => ['/login', '/register'].includes(route.path));

        const toggleLeftDrawer = () => {
            leftDrawerOpen.value = !leftDrawerOpen.value;
        };

        const logout = () => {
            authStore.logout();
            router.push('/login');
        };

        return {
            leftDrawerOpen,
            router,
            toggleLeftDrawer,
            isAuthenticated,
            isAuthRoute,
            logout,
        };
    },
});
</script>

<style scoped>
.bg-primary {
    background-color: #6200ea;
}

.text-white {
    color: white;
}

.drawer {
    background-color: #6200ea;
    color: white;
}
.q-drawer {
    background: rgba(255, 255, 255, .3);
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    border: 1.5px solid rgba(209, 213, 219, 0.3);
    color: white;
}
</style>
