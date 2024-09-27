<template>
    <q-drawer v-model="localModel" show-if-above :width="240">
        <q-scroll-area class="fit">
            <q-list padding>
                <div class="q-pa-sm">
                    <div class="row justify-center items-center column q-pb-sm ">
                        <q-img :src="logoUrl" spinner-color="red" class="img-logo" />
                    </div>
                    <q-item-label header class="text-weight-bold text-uppercase q-mt-md q-mb-xs text-theme">
                        Settings Admin
                    </q-item-label>

                    <q-item v-for="route in routes" :key="route.name" v-ripple clickable :to="route.path" exact
                        class="item-drawer-user q-my-sm" active-class="active-drawer-item">
                        <q-item-section avatar class="icon-section-drawer-user">
                            <q-icon :name="route.icon" />
                        </q-item-section>
                        <q-item-section class="text-section-drawer-user">
                            <q-item-label>{{ route.title }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </div>
            </q-list>
        </q-scroll-area>
    </q-drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from 'stores/auth';
const authStore = useAuthStore();
// Recibimos el valor del v-model como prop
const props = defineProps({
    leftDrawerOpen: Boolean, // El valor vinculado al v-model, en este caso un booleano para abrir/cerrar el drawer
});
import logoUrl from 'src/assets/logo.webp';
// Definimos una variable local para manejar el valor del v-model
const localModel = ref(props.modelValue);
const routes = ref();
onMounted(async () => {
    try {
        const rou = await authStore.userRoutes();
        routes.value = rou
        console.log(rou, 'routes')

    } catch (error) {
        console.error('Error fetching user:', error);
    }
});
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

.img-logo {
    height: 100px;
    max-width: 200px;
    border-radius: 10px;
}

</style>
