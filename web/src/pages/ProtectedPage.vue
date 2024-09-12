<template>
    <div>
        <!-- Formulario para actualizar el perfil -->
        <form @submit.prevent="updateProfile">
            <input v-model="name" placeholder="Name">
            <input v-model="email" placeholder="Email">
            <input v-model="personal_phone" placeholder="Phone">
            <input v-model="avatar" placeholder="Avatar URL">
            <button type="submit">Save Changes</button>
        </form>

        <!-- Formulario para cambiar la contraseña -->
        <form @submit.prevent="updatePassword">
            <input type="password" v-model="currentPassword" placeholder="Current Password">
            <input type="password" v-model="newPassword" placeholder="New Password">
            <button type="submit">Change Password</button>
        </form>
    </div>
</template>

<script>
import { gql } from '@apollo/client';

export default {
    data() {
        return {
            name: '',
            email: '',
            personal_phone: '',
            avatar: '',
            currentPassword: '',
            newPassword: ''
        };
    },
    methods: {
        async updateProfile() {
            const mutation = gql`
          mutation EditUserProfile($name: String, $email: String, $personal_phone: String, $avatar: String) {
            editUserProfile(name: $name, email: $email, personal_phone: $personal_phone, avatar: $avatar) {
              id
              name
              email
              personal_phone
              avatar
            }
          }
        `;

            try {
                const response = await this.$apollo.mutate({
                    mutation,
                    variables: {
                        name: this.name,
                        email: this.email,
                        personal_phone: this.personal_phone,
                        avatar: this.avatar
                    }
                });
                console.log('Profile updated:', response.data.editUserProfile);
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        },

        async updatePassword() {
            const mutation = gql`
          mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
            changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
          }
        `;

            try {
                const response = await this.$apollo.mutate({
                    mutation,
                    variables: {
                        currentPassword: this.currentPassword,
                        newPassword: this.newPassword
                    }
                });
                if (response.data.changePassword) {
                    console.log('Password changed successfully');
                }
            } catch (error) {
                console.error('Error changing password:', error);
            }
        }
    }
};
</script>
