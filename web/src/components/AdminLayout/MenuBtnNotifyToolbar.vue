<template>
    <q-menu auto-close fit class="btn-toolbar menu-user-top shadow-menu-user div-blur q-px-md">
        <q-list>
            <div class="q-px-md">
                <q-item clickable class="item-menu-user">
                    <q-item-section class="q-pa-xs">
                        <div class="text-h6 text-center q-mt-sm q-mb-xs text-theme ellipsis">
                            Notifications
                        </div>
                    </q-item-section>

                </q-item>
                <q-separator class="q-my-xs" />
                <q-item clickable class="item-menu-user">
                    <q-item-section avatar class="icon-section-menu-user q-my-xs">
                        <q-icon name="mail_outline" size="20px" />
                    </q-item-section>
                    <q-item-section class="text-section-menu-user">
                        Tienes 5 mensajes
                    </q-item-section>
                </q-item>
                <q-item clickable class="item-menu-user q-mb-md">
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
