<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Register</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <RegisterForm @registerError="displayErrors"/>
            <FlashMessage :error="error"/>
        </ion-content>
    </ion-page>
</template>

<script>
    import RegisterForm                                             from "@/components/RegisterForm";
    import FlashMessage                                             from "@/components/FlashMessage";
    import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

    export default {
        name: "Register",
        components: {
            RegisterForm,
            IonPage,
            IonHeader,
            IonToolbar,
            IonTitle,
            IonContent,
            FlashMessage,
        },
        data() {
            return {
                error: null,
            };
        },
        methods: {
            displayErrors(payload) {
                this.error = payload.error;
            },
        },
    };
</script>