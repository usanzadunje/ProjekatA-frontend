<template>
    <form @submit.prevent="login">
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
                    </div>
                    <div class="padding">
                        <ion-button size="large" type="submit" expand="block">Login
                        </ion-button>
                    </div>
                </ion-col>
            </ion-row>
        </ion-grid>
    </form>
</template>

<script>
    import { IonGrid, IonCol, IonRow, IonItem, IonInput, IonButton, IonLabel } from "@ionic/vue";
    import AuthService                                                         from "@/services/AuthService";

    export default {
        name: "LoginForm",
        components: {
            IonGrid,
            IonCol,
            IonRow,
            IonItem,
            IonInput,
            IonButton,
            IonLabel,
        },
        data() {
            return {
                email: null,
                password: null,
            };
        },
        methods: {
            login() {
                const payload = {
                    email: this.email,
                    password: this.password,
                };
                const redirectedFrom = this.$route.query.redirect ?? '/dashboard';
                AuthService.login(payload)
                           .then(() => {
                               this.$router.push(redirectedFrom);
                           })
                           .catch((error) => (console.log(error)));
            },
        },
    };
</script>