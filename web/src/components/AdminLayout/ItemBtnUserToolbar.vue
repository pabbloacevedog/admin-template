<template>
        <q-item class="q-pa-none item-user">
            <q-item-section avatar class="q-pa-none">
                <q-avatar>
                    <img :src="authStore.user?.avatar">
                </q-avatar>
            </q-item-section>
            <q-item-section class="q-pa-none">
                <q-item-label>{{ authStore.user?.name }}</q-item-label>
                <!-- <q-item-label caption style="font-size: 10px;">
                                    {{ authStore.user?.email }}
                                </q-item-label> -->
            </q-item-section>
        </q-item>
</template>

<script setup>
import { useAuthStore } from 'stores/auth';
const authStore = useAuthStore();
console.log(authStore.user)
</script>
