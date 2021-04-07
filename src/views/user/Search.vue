<template>
  <ion-page>
    <UserHeader
        :hasSearchFilter="false"
        :mainHeading="'Pretraga'"
        :notificationIcon="notificationsReceivedOutline"
    >
      <SlidingFilter :hasTitle="true"/>
    </UserHeader>

    <ion-content class="ion-padding">
      <div v-if="!loggedIn">
        <ion-button color="primary" routerLink="/login">Login</ion-button>
        <ion-button color="primary" routerLink="/register">Register</ion-button>
      </div>
      <ion-button color="secondary" @click="logout" v-else>Logout</ion-button>
      <ion-button color="warning" routerLink="/cafes">Cafes</ion-button>
      <ion-button color="warning" routerLink="/testEmailVerification">testEmailVerification</ion-button>
      <ion-button color="warning" routerLink="/test">Test</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent }                                    from 'vue';
import {
  IonContent,
  IonPage,
  IonButton,
}                                                             from '@ionic/vue';
import { mapGetters, useStore }                               from 'vuex';
import UserHeader                                             from '@/components/user/UserHeader';
import SlidingFilter                                          from '@/components/user/SlidingFilter';
import { notificationsOutline, notificationsReceivedOutline } from '@/assets/icons';


export default defineComponent({
  name: 'Search',
  components: {
    IonContent,
    IonPage,
    IonButton,
    UserHeader,
    SlidingFilter,
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
  },
  setup() {
    /* Global properties and methods */
    const store = useStore();

    /* Component methods */
    const logout = () => store.dispatch('auth/logout');

    return {
      /* Methods */
      logout,

      /* Icons */
      notificationsOutline,
      notificationsReceivedOutline,
    };
  },
});
</script>