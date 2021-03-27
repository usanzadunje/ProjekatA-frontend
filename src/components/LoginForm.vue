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
            <ion-button color="primary" href="/forgot-password">Forgot Password?</ion-button>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
    <FlashMessage :error="error"/>
  </form>
</template>

<script>
import { IonGrid, IonCol, IonRow, IonItem, IonInput, IonButton, IonLabel } from "@ionic/vue";
import { mapGetters }                                                      from "vuex";
import AuthService                                                         from "@/services/AuthService";
import { getError }                                                        from '@/utils/helpers';
import FlashMessage                                                        from '@/components/FlashMessage';
import store                                                               from '@/store/index';

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
    FlashMessage,
  },
  data() {
    return {
      email: null,
      password: null,
      error: null,
    };
  },
  methods: {
    login() {
      const payload = {
        email: this.email,
        password: this.password,
      };

      AuthService.login(payload)
                 .then(async() => {
                   await store.dispatch("auth/getAuthUser");
                   let homeRoute = store.getters["auth/isStaff"] ? { name: 'staff.home' } : { name: 'home' };
                   this.$router.push(homeRoute);
                 })
                 .catch((error) => {
                   this.error = getError(error);
                   this.$emit('loginError', {
                     error: this.error,
                   });
                 });
    },
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
  },
};
</script>