<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Register</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            {{ authUser }}
        </ion-content>
    </ion-page>
</template>

<script>
    import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
    import { mapGetters }                                           from 'vuex';

    export default {
        name: "Dashboard",
        components: {
            IonPage,
            IonHeader,
            IonToolbar,
            IonTitle,
            IonContent,
        },
        computed: {
            ...mapGetters('auth', ['authUser']),
        },
    };
</script>