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
      <InfiniteScroll/>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent }                          from 'vue';
import {
  IonContent,
  IonPage,
}                                                             from '@ionic/vue';
import { mapGetters, useStore }                               from 'vuex';
import UserHeader                                             from '@/components/user/UserHeader';
import SlidingFilter                                          from '@/components/user/SlidingFilter';
import InfiniteScroll                                         from '@/components/InfiniteScroll';
import { notificationsOutline, notificationsReceivedOutline } from '@/assets/icons';


export default defineComponent({
  name: 'Search',
  components: {
    IonContent,
    IonPage,
    UserHeader,
    SlidingFilter,
    InfiniteScroll,
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