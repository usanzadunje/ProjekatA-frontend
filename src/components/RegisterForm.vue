<template>
    <form @submit.prevent="registerUser">
        <ion-grid>
            <ion-row color="primary" class="justify-content-center">
                <ion-col class="align-self-center" size-md="6" size-lg="5" size-xs="12">
                    <div class="padding">
                        <ion-item>
                            <ion-label position="floating">First Name</ion-label>
                            <ion-input v-model="fname" name="fname" type="text" required></ion-input>
                        </ion-item>
                        <ion-item>
                            <ion-label position="floating">Last Name</ion-label>
                            <ion-input v-model="lname" name="lname" type="text" required></ion-input>
                        </ion-item>
                        <ion-item class="ion-padding-top">
                            <ion-label>Birthday</ion-label>
                            <ion-datetime :value="bday"
                                          @ionChange="bday = $event.target.value.substring(0,10)"></ion-datetime>
                        </ion-item>
                        <ion-item>
                            <ion-label position="floating">Phone</ion-label>
                            <ion-input v-model="phone" name="phone" type="tel" required></ion-input>
                        </ion-item>
                        <ion-item>
                            <ion-label position="floating">Username</ion-label>
                            <ion-input v-model="username" name="username" type="text" required></ion-input>
                        </ion-item>
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
                        <ion-button size="large" type="submit" expand="block">Register
                        </ion-button>
                    </div>
                </ion-col>
            </ion-row>
        </ion-grid>
    </form>
</template>

<script>
    import { IonGrid, IonCol, IonRow, IonItem, IonInput, IonButton, IonLabel, IonDatetime } from "@ionic/vue";
    import AuthService
                                                                                            from '@/services/AuthService';
    import { getError }                                                                     from '../utils/helpers';

    export default {
        name: "RegisterForm",
        components: {
            IonGrid,
            IonCol,
            IonRow,
            IonItem,
            IonInput,
            IonButton,
            IonLabel,
            IonDatetime,
        },
        data() {
            return {
                fname: null,
                lname: null,
                bday: new Date().toDateString().substring(4),
                phone: null,
                username: null,
                email: null,
                password: null,
                passwordConfirm: null,
                error: null,
            };
        },
        methods: {
            registerUser() {
                const payload = {
                    fname: this.fname,
                    lname: this.lname,
                    bday: this.bday,
                    phone: this.phone,
                    username: this.username,
                    email: this.email,
                    password: this.password,
                    password_confirmation: this.passwordConfirm,
                };
                AuthService.registerUser(payload)
                           .then(() => this.$router.push("/dashboard"))
                           .catch((error) => {
                               this.error = getError(error);
                               this.$emit('registerError', {
                                   error: this.error,
                               });
                           });
            },
        },
    };
</script>