<template>
    <q-menu auto-close fit class="btn-toolbar menu-user-top no-shadow">
        <q-list>
            <div class="q-pa-sm">
                <q-item clickable class="item-menu-user">
                    <q-item-section class="q-pa-xs">
                        <q-item-label style="font-size: 16px;">
                            Notifications
                        </q-item-label>
                    </q-item-section>

                </q-item>
                <q-item clickable class="item-menu-user">
                    <q-item-section avatar class="icon-section-menu-user">
                        <q-icon name="mail_outline" size="20px" />
                    </q-item-section>
                    <q-item-section class="text-section-menu-user">
                        Tienes 5 mensajes
                    </q-item-section>
                </q-item>
                <q-item clickable class="item-menu-user">
                    <q-item-section avatar class="icon-section-menu-user">
                        <q-icon name="check_circle_outline" size="20px" />
                    </q-item-section>
                    <q-item-section class="text-section-menu-user">5 reservas nuevas</q-item-section>
                </q-item>
            </div>
        </q-list>
    </q-menu>
</template>

<script setup>
import { ref } from 'vue';

</script>
