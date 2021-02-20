<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Login</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <ion-item>
                <ion-label position="floating">E-mail</ion-label>
                <ion-input v-model="email"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">Password</ion-label>
                <ion-input v-model="password"></ion-input>
            </ion-item>
            <ion-button color="primary">Login</ion-button>
        </ion-content>
    </ion-page>
</template>

<script>
    import {
        IonContent,
        IonHeader,
        IonPage,
        IonTitle,
        IonToolbar,
        IonItem,
        IonLabel,
        IonInput,
        IonButton,
    }                          from '@ionic/vue';
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'Login',
        components: {
            IonContent,
            IonHeader,
            IonPage,
            IonTitle,
            IonToolbar,
            IonItem,
            IonLabel,
            IonInput,
            IonButton,
        },
        data() {
            return {
                email: '',
                password: '',
            };
        },
        ionViewWillEnter() {
            this.axios.get('//127.0.0.1:8000/sanctum/csrf-cookie')
                .then(response => {
                    console.log(response);
                    this.axios.get('//127.0.0.1:8000/login')
                        .then(response => {
                            console.log(response);
                        });
                })
                .catch(error => {
                    console.log(error);
                });
        },
    });
</script>

<style scoped>

</style>