<template>
    <q-dialog v-model="localModel" persistent>
        <q-card>
            <q-card-section>
                <q-input v-model="form.name" filled label="Role Name"
                    :rules="[val => !!val || 'Role name is required']" />
                <q-input v-model="form.description" filled label="Description" type="textarea"
                    :rules="[val => !!val || 'Description is required']" />
            </q-card-section>

            <q-card-actions>
                <q-btn label="Cancel" @click="closeModal" />
                <q-btn label="Save" color="primary" @click="saveRole" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
    role: {
        type: Object,
        default: () => ({}),
    },
});
const localModel = ref(props.isOpen);
const role = ref(props.role);
console.log(role.value,'role')
const emit = defineEmits(['close', 'save']);
const form = ref({
    name: '',
    description: '',
});

// Close modal
const closeModal = () => {
    emit('close');
};

// Save role
const saveRole = () => {
    if (form.value.name && form.value.description) {
        emit('save', { ...form.value });
        closeModal();
    }
};
onMounted(async () => {
    try {
        form.value = role.value;
    } catch (error) {
        console.error('Error fetching user:', error);
    }
});
</script>

<style scoped>
/* Add any styles for your modal here */
</style>
