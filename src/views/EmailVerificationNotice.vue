<!-- View shown when user has not verified their email address or want to resend it-->
<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Verify Your Email Address</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true" class="ion-padding">
            <form @submit.prevent="sendVerificationEmail">
                <button type="submit" class="text-red-300">
                    click here to request another one.
                </button>
                .
            </form>
            <FlashMessage :message="message" :error="error"/>
        </ion-content>
    </ion-page>
</template>


<script>
    import FlashMessage                                             from '../components/FlashMessage';
    import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
    import AuthService                                              from '../services/AuthService';
    import { getError }                                             from '../utils/helpers';

    export default {
        name: 'EmailVerificationNotice',
        components: {
            IonPage,
            IonHeader,
            IonToolbar,
            IonTitle,
            IonContent,
            FlashMessage,
        },
        data() {
            return {
                message: null,
                error: null,
            };
        },
        methods: {
            sendVerificationEmail() {
                this.error = null;
                this.message = null;

                AuthService.resendVerificationEmail()
                           .then(() => (this.message = "A fresh verification link has been sent to your email address."))
                           .catch((error) => (this.error = getError(error)));
            },
        },
    };
</script>
