<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Password Reset</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="ion-padding">
            <form @submit.prevent="resetPassword">
                <ion-grid>
                    <ion-row color="primary" class="justify-content-center">
                        <ion-col class="align-self-center" size-md="6" size-lg="5" size-xs="12">
                            <div class="padding">
                                <ion-item>
                                    <ion-label position="floating">Email</ion-label>
                                    <ion-input v-model="email" name="email" type="email" required></ion-input>
                                </ion-item>
                                <ion-item>
                                    <ion-label position="floating">Password</ion-label>
                                    <ion-input v-model="password" name="password" type="password" required></ion-input>
                                </ion-item>
                                <ion-item>
                                    <ion-label position="floating">Confirm Password</ion-label>
                                    <ion-input v-model="passwordConfirm" name="password-confirm" type="password"
                                               required></ion-input>
                                </ion-item>
                            </div>
                            <div class="padding">
                                <ion-button size="large" type="submit" expand="block">Reset Password
                                </ion-button>
                            </div>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </form>
          <ion-button color="warning" routerLink="/">Home</ion-button>
            <FlashMessage :error="error"/>
        </ion-content>
    </ion-page>
</template>

<script>
    import {
        IonPage,
        IonHeader,
        IonToolbar,
        IonContent,
        IonTitle,
        IonButton,
        IonGrid,
        IonCol,
        IonRow,
        IonItem,
        IonInput,
        IonLabel,
    }                   from '@ionic/vue';
    import AuthService  from "@/services/AuthService";
    import { getError } from '@/utils/helpers';
    import FlashMessage from "@/components/FlashMessage";

    export default {
        name: "ForgotPassword",
        components: {
            IonPage,
            IonHeader,
            IonToolbar,
            IonContent,
            IonTitle,
            IonButton,
            IonGrid,
            IonCol,
            IonRow,
            IonItem,
            IonInput,
            IonLabel,
            FlashMessage,
        },
        data() {
            return {
                email: null,
                password: null,
                passwordConfirm: null,
                error: null,
            };
        },
        methods: {
            resetPassword() {
                this.error = null;

                const payload = {
                    email: this.email,
                    password: this.password,
                    password_confirmation: this.passwordConfirm,
                    token: this.$route.query.token,
                };
                AuthService.resetPassword(payload)
                           .then(() => this.$router.push({ name: 'login' }))
                           .catch((error) => this.error = getError(error));
            },
        },

    };
</script>