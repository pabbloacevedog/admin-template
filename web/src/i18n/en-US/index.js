// This is just an example,
// so you can safely delete all default props below

export default {
    failed: "Action failed",
    success: "Action was successful",
    menu: {
        btn_logout: "Close session",
        btn_account: "Account",
    },
    login: {
        title: "Welcome",
        description: "Sign in to your account",
        email: "Email",
        password: "Password",
        sign_up: "Sign up",
        new_user: "You do not have an account?",
        forgot_password: "Did you forget your password?",
        btn_login: "Log in",
        btn_google: "Sign in with Google",
        select_different_user: "Log in with another account",
        errors: {
            password_required: "Password is required.",
            password_invalid: "Password: min 6 chars, 1 uppercase, 1 number.",
            email_required: "Email is required.",
            email_invalid: "Please enter a valid email.",
            fix_errors: "Please correct the errors before continuing.",
        },
    },
    forgot_password: {
        title: "Forgot your password?",
        description: "Enter your email for instructions",
        email: "Email",
        btn_send: "SEND CODE",
        errors: {
            email_required: "Email is required.",
            fix_errors: "Please correct the errors before continuing.",
        },
    },
    verify_code: {
        title: "Verify Email",
        description: "Enter the verification code you received in your email",
        code: "Code",
        btn_send: "Verify code",
        errors: {
            code_required: "Code required.",
            fix_errors: "Please correct the errors before continuing.",
        },
    },
    reset_password: {
        title: "Set new password",
        description: "Enter you new password",
        new_password: "New Password",
        confirm_password: "Confirm Password",
        btn_send: "Reset password",
        errors: {
            new_password_required: "Password is required.",
            passwords_do_not_match: "Passwords do not match.",
            fix_errors: "Please correct the errors before continuing.",
        },
    },
    register: {
        title: "Create your account",
        description: "Sign up",
        email: "Email",
        name: "Name",
        pass: "Password",
        login: "Log in",
        old_user: "Do you have an account?",
        btn_signup: "Sign up",
        errors: {
            password_required: "Password is required.",
            password_invalid: "Password: min 6 chars, 1 uppercase, 1 number.",
            email_required: "Email is required.",
            email_invalid: "Please enter a valid email.",
            name_min_length: "Name must be at least 3 characters.",
            name_required: "Name is required.",
            fix_errors: "Please correct the errors before continuing.",
        },
    },
    verify_email: {
        title: "Verify Your Email",
        description: "Click the button below to verify your email address.",
        btn_verify: "Verify Email",
        verifying: "We are verifying your email...",
        success: "Your email has been verified successfully!",
        errors: {
            invalid_token: "The verification token is invalid or has expired.",
            token_missing: "Verification token is missing.",
        },
    },
    notFound: {
        message: "Oops ... we don't have anything around here.",
        btn_home: "Go back",
    },
    users: {
        title: "User Management",
        description: "Manage your team members and their account permissions.",
        icon: 'supervised_user_circle',
        btn_create: "Add user",
        account: {
            rut_user: {
                title: "Personal DNI ",
                description: "Write the personal ID",
            },
            name: {
                title: "Full Name *",
                description: "Write the full name",
            },
            username: {
                title: "Username",
                description: "Chose a username",
            },
            email: {
                title: "Email address *",
                description: "Email linked to the account",
            },
            personal_phone: {
                title: "Phone",
                description: "Write the current phone",
            },
            role: {
                title: "Role",
                description: "Chose de role for the account",
            },
            verified: {
                title: "Verified",
                description: "shows if the email has been verified",
            },
            state: {
                title: "State",
                description: "Show if the account is active or inactive.",
            },
            avatar: {
                title: "Avatar",
                description: "The profile photo",
            },
            password: {
                title: "Password *",
                description: "Write the password",
            }
        },
        edit: {
            title: "Update data user",
            description: "Complete all data user",
            verify_manually: "Verify manually",
            upload_avatar: "Avatar update successfully",
            btn_action: "Update",
            btn_cancel: "Cancel"
        },
        create: {
            title: "Create a new user",
            description: "Complete all data user",
            upload_avatar: "Avatar upload successfully",
            btn_action: "Create Account",
            btn_cancel: "Cancel"
        },
        delete: {
            message: "Are you sure you want to delete the account of ",
            title: "Delete user account",
            description: "You need to confirm for delete user account",
            deleted_success: "User account deleted successfully",
            btn_action: "Delete",
            btn_cancel: "Cancel"
        },
        view: {
            btn_action: "Close"
        },
        errors: {
            password_required: "Password is required.",
            password_invalid: "Password: min 6 chars, 1 uppercase, 1 number.",
            email_required: "Email is required.",
            email_invalid: "Please enter a valid email.",
            name_min_length: "Name must be at least 3 characters.",
            name_required: "Name is required.",
            role_required: "Select a role for the user.",
            fix_errors: "Please correct the errors before continuing.",
        },
    },
    roles: {
        title: "Role Management",
        description: "Manage your roles and their routes and actions",
        icon: 'attribution',
        btn_create: "Add Role",
        account: {
            role_id: {
                title: "Role ID",
                description: "Write the role ID",
            },
            name: {
                title: "Role Name *",
                description: "Write the role name",
            },
            title: {
                title: "Title",
                description: "Title for show the role",
            },
            description: {
                title: "Description",
                description: "Description for show the role",
            },
            color: {
                title: "Color",
                description: "Color that represents the role",
            },
        },
        edit: {
            title: "Update data role",
            description: "Complete all data role",
            instruction: "Edit the role details: name, title, and color. On the right, assign the routes the role can access, along with the actions available for each route. Additionally, specify a condition for each action.",
            upload_avatar: "Avatar update successfully",
            btn_action: "Update",
            btn_cancel: "Cancel"
        },
        create: {
            title: "Create a new role",
            description: "Complete all data role",
            instruction: "Create a new role. Name, title, and color are required. On the right, assign the routes the role can access, along with the actions available for each route. Additionally, specify a condition for each action.",
            btn_action: "Create Role",
            btn_cancel: "Cancel",
            validation_no_actions: "You must select at least one action for each selected route."
        },
        delete: {
            message: "Are you sure you want to delete the role ",
            message_no_delete_1: "You can't delete this role ",
            message_no_delete_2: " because it has users.",
            title: "Delete role ",
            description: "You need to confirm for delete role",
            deleted_success: "Role account deleted successfully",
            btn_action: "Delete",
            btn_cancel: "Cancel"
        },
        view: {
            btn_action: "Close",
            message: "This role has the following access and permissions.",
        },
        errors: {
            title_required: "Title is required.",
            title_min_length: "Title must be at least 3 characters.",
            description_required: "Description is required.",
            description_min_length: "Description must be at least 3 characters.",
            name_min_length: "Name must be at least 3 characters.",
            name_required: "Name is required.",
            fix_errors: "Please correct the errors before continuing.",
            color_required: "You must select a color for the role.",
        },
    },
    account: {
        title: "Account",
        description: "Here you can manage your account",
        account: "Account",
        appearance_account: "Appearance",
        notification_account: "Notifications",
        btn_save: "Save",
        account: {
            rut_user: {
                title: "Personal DNI ",
                description: "Write your personal ID",
            },
            name: {
                title: "Full Name",
                description: "Write your full name",
            },
            username: {
                title: "Username",
                description: "Chose a username",
            },
            email: {
                title: "Email address",
                description: "Email linked to your account",
            },
            personal_phone: {
                title: "Phone",
                description: "Write your current phone",
            },
            avatar: {
                title: "Avatar",
                description: "You can change your profile photo",
            },
            current_password: {
                title: "Current password",
                description: "Write your current password",
            },
            new_password: {
                title: "Current password",
                description: "Write your new password",
            },
            confirm_password: {
                title: "Confirm password",
                description: "Confirm your new password",
            },
        },
        security: {
            current_password: "Current Password",
            new_password: "New Password",
            confirm_password: "Confirm Password",
        },
        theme: {
            dark_mode: {
                title: "Dark or Light Mode",
                description: "You can chose your favorite theme",
            },
        },
        tabs: {
            title: "Account Settings",
            description: "Personal Information",
            icon: 'manage_accounts',
            general: {
                personal: {
                    subtitle: "Personal Information",
                    description: "All your personal information",
                },
                contact: {
                    subtitle: "Cotact Information",
                    description: "Complete your contact information",
                },
            },
            security: {
                title: "Security",
                description: "Change Password",
            },
            theme: {
                title: "Apparences",
                description: "Dark and Light Mode",
            },
        },

        appearance: {
            dark_mode: "Dark Mode",
            glass_mode: "Glass Mode",
        },
        notifications: {
            orders: "Orders",
            busy_table: "Busy table",
            account_request: "Account request",
            partner_login: "Partner Login",
            partner_messages: "Peer messages",
            customer_messages: "Customer Messages",
            help_customers: "Help clients",
            help_partners: "Help colleagues",
        },
        errors: {
            new_password_required: "La nueva contraseña es obligatoria.",
            passwords_do_not_match: "Las contraseñas no coinciden.",
            fix_errors: "Por favor, corrige los errores antes de continuar.",
        },
    },
};
