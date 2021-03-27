<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Forgot Password</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="ion-padding">
            <form @submit.prevent="forgotPassword">
                <ion-grid>
                    <ion-row color="primary" class="justify-content-center">
                        <ion-col class="align-self-center" size-md="6" size-lg="5" size-xs="12">
                            <div class="padding">
                                <ion-item>
                                    <ion-label position="floating">Email</ion-label>
                                    <ion-input v-model="email" name="email" type="email" required></ion-input>
                                </ion-item>
                            </div>
                            <div class="padding">
                                <ion-button size="large" type="submit" expand="block">Send
                                </ion-button>
                            </div>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </form>
          <ion-button color="warning" routerLink="/">Home</ion-button>
          <FlashMessage :error="error" :message="message"/>
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
                error: null,
                message: null,
            };
        },
        methods: {
            forgotPassword() {
                this.error = null;
                this.message = null;
                const payload = {
                    email: this.email,
                };
                AuthService.forgotPassword(payload)
                           .then((response) => this.message = response.data.message)
                           .catch((error) => this.error = getError(error));
            },
        },

    };
</script>