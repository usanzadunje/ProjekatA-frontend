<template>
  <ion-page>
    <UserHeader
        :hasSearchFilter="true"
        :mainHeading="'Pronadji slobodno mesto'"
        :notificationIcon="notificationsOutline"
    />

    <ion-content class="ion-padding">
      <div>
        <FilterCategoryHeading class="mb-2"/>
        <div v-for="cafe in cafes" :key="cafe.id" class="mb-5">
          <CafeCard :cafe="cafe"/>
        </div>
      </div>

      <div>
        <FilterCategoryHeading class="mb-2"/>
        <div v-for="cafe in cafes" :key="cafe.id" class="mb-5">
          <CafeCard :cafe="cafe"/>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref }                               from 'vue';
import {
  IonContent,
  IonPage,
  // IonSlides,
  // IonSlide,
}                                                             from '@ionic/vue';
import UserHeader                                             from '@/components/user/UserHeader';
import CafeService                                            from '@/services/CafeService';
import { useFCM }                                             from '@/composables/useFCM';
import { notificationsOutline, notificationsReceivedOutline } from '@/assets/icons';
import CafeCard                                               from '@/components/user/CafeCard';
import FilterCategoryHeading                                  from '@/components/user/FilterCategoryHeading';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    UserHeader,
    CafeCard,
    FilterCategoryHeading,
    /*    IonSlides,
        IonSlide,*/
  },
  setup() {
    /*
      Properties
    */
    let cafes = ref([]);

    /*
      Lifecycle hooks
    */
    /* Fetching all cafes from backend */
    CafeService.getCafeCardsChunkInfo(0, 2).then((response) => cafes.value = response.data).catch((error) => alert(error));

    /*
      Methods
    */
    /* Method for initializing push notifications for mobile devices */
    const { initPush } = useFCM();
    initPush();

    /* Adding pair of user/cafe in database corresponding to authenticated user subscribed to certain cafe */
    const subscribe = (cafeId) => {
      let cafeName = cafes.value.filter(cafe => cafe.id === cafeId)[0].name;
      CafeService.subscribe(cafeId).then(() => alert(`Successfully subscribed to ${cafeName}!`)).catch((error) => alert(error));
    };

    return {
      /* Properties */
      cafes,

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
