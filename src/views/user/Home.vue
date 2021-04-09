<template>
  <ion-page>
    <UserHeader
        :hasSearchFilter="true"
        :mainHeading="'Pronadji slobodno mesto'"
        :notificationIcon="notificationsOutline"
    />

    <ion-content>
      <div v-for="cafe in state.cafes" :key="cafe.id">
        Cafe: {{ cafe.name }}
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import {
  IonContent,
  IonPage,
  // IonSlides,
  // IonSlide,
}                                    from '@ionic/vue';
import UserHeader                    from '@/components/user/UserHeader';
import CafeService                   from '@/services/CafeService';
import { useFCM }                    from '@/composables/useFCM';
import { notificationsOutline, notificationsReceivedOutline } from '@/assets/icons';


export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    UserHeader,
    /*    IonSlides,
        IonSlide,*/
  },
  setup() {
    /*
      Properties
    */
    let state = reactive({ cafes: [] });

    /*
      Lifecycle hooks
    */
    /* Fetching all cafes from backend */
    CafeService.getCafeCardsChunkInfo(0,2).then((response) => state.cafes = response.data).catch((error) => alert(error));

    /*
      Methods
    */
    /* Method for initializing push notifications for mobile devices */
    const { initPush } = useFCM();
    initPush();

    /* Adding pair of user/cafe in database corresponding to authenticated user subscribed to certain cafe */
    const subscribe = (cafeId) => {
      let cafeName = state.cafes.filter(cafe => cafe.id === cafeId)[0].name;
      CafeService.subscribe(cafeId).then(() => alert(`Successfully subscribed to ${cafeName}!`)).catch((error) => alert(error));
    };

    return {
      /* Properties */
      state,

      /* Methods */
      initPush,
      subscribe,

      /* Icons */
      notificationsOutline,
      notificationsReceivedOutline,
    };
  },
});
</script>
