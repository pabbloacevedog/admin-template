<template>
    <q-item class="q-pa-none q-py-sm">
        <q-item-section avatar class="q-pa-none">
            <q-avatar size="50px">
                <img :src="user?.avatar" v-if="user?.avatar">
                <q-icon v-else name="account_circle" color="second" style="font-size: 48px;width: 40px;height: 40px;" class="p-qa-none" />
            </q-avatar>
        </q-item-section>
        <q-item-section class="q-pa-none q-pl-md">
            <q-item-label class="text-weight-bold">{{ user?.name }}</q-item-label>
            <q-item-label caption style="font-size: 11px;" v-if="user?.email">
                <q-icon name="mail_outline" color="primary" size="xs" /> {{ user?.email }}
            </q-item-label>
        </q-item-section>
    </q-item>
</template>

<script setup>
const props = defineProps({
    user: {
        type: Object,
        default: () => ({}),
    },
});
</script>
<script>
export default {
    name: 'ItemUserTable',
}
</script>
