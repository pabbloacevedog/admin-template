<template>
    <div class="text-center">
        <q-card class="col-12 w-100 div-rounded-radius" flat>
                <q-card-section v-if="$q.platform.is.mobile" class="row col-12 items-center justify-center">
                    <q-card-section class="col-4 col-md-4 col-xs-12 text-center items-center justify-center">
                        <AvatarUploader />
                    </q-card-section>
                    <q-card-section class="col-6 col-md-6 col-xs-12 text-center items-center justify-center">
                        <div class="text-h4">{{ authStore.user?.name }}</div>
                        <div class="text-h6 text-second">{{ authStore.user?.email }}</div>
                    </q-card-section>
                </q-card-section>
                <q-card-section v-else horizontal class="row col-12 items-center justify-center q-pa-none">
                    <q-card-section class="col-4 col-md-4 col-xs-12 text-center items-center justify-center">
                        <AvatarUploader />
                    </q-card-section>
                    <q-card-section class="col-6 col-md-6 col-xs-12 text-center items-center justify-center q-pa-none">
                        <div class="text-h4 q-mb-md">{{ authStore.user?.name }}</div>
                        <div class="text-h6 text-second">{{ authStore.user?.email }}</div>
                    </q-card-section>
                </q-card-section>
            </q-card>
    </div>
</template>

<script setup>
import AvatarUploader from './AvatarUploader.vue';
import { useAuthStore } from 'stores/auth';
const authStore = useAuthStore();
</script>
<script>
export default {
    name: 'HeaderSettingsUser',
}
</script>
