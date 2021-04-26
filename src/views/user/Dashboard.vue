<template>
  <ion-page>
    <UserProfileHeader/>

    <ion-content>
      <SlidingFilter class="mt-2" @sortHasChanged="sortHasChanged"/>

      <div class="px-5 mt-2">
        <FilterCategoryHeading title="Kafici koje pratim" class="mb-2"/>

        <ion-item-sliding v-for="cafe in cafesUserSubscribedTo" :key="cafe.id" class="ion-no-padding mb-5">
          <ion-item class="ion-no-padding ion-no-margin">
            <CafeCard :cafe="cafe" class="w-full"/>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option type="button" @click="unsubscribe(cafe.id)">
              <ion-icon
                  slot="icon-only"
                  :icon="trashcanOutline"
                  class="text-2xl"
              ></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';

import { mapGetters } from 'vuex';

import {
  IonContent,
  IonPage,
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonItemOption,
  IonIcon,
}                            from '@ionic/vue';
import UserProfileHeader     from '@/components/user/UserProfileHeader';
import SlidingFilter         from '@/components/user/SlidingFilter';
import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import CafeCard              from '@/components/user/CafeCard';

import CafeService from '@/services/CafeService';

import {
  trashcanOutline,
} from '@/assets/icons';


export default defineComponent({
  name: 'Dashboard',
  components: {
    IonContent,
    IonPage,
    IonItemSliding,
    IonItem,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    UserProfileHeader,
    SlidingFilter,
    FilterCategoryHeading,
    CafeCard,
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
  },
  ionViewDidEnter() {
    //*Everytime user comes to the page give him view of fresh cafes he has subscribed to
    CafeService.getAllCafesUserSubscribedTo(this.sortBy)
               .then((response) => {
                 this.cafesUserSubscribedTo = response.data;
               })
               .catch((error) => alert(error));
  },
  setup() {
    /* Properties */
    // Cafes user is subscribed to
    let cafesUserSubscribedTo = ref([]);
    let sortBy = ref('name');

    /* Event handlers */
    const sortHasChanged = (sortValue) => {
      sortBy.value = sortValue;
      CafeService.getAllCafesUserSubscribedTo(sortValue)
                 .then((response) => {
                   cafesUserSubscribedTo.value = response.data;
                 })
                 .catch((error) => alert(error));
    };

    const unsubscribe = (cafeId) => {
      CafeService.unsubscribe(cafeId)
                 .then((response) => {
                   if(response.data){
                     alert('Successfully unsubscribed!');
                     cafesUserSubscribedTo.value = cafesUserSubscribedTo.value.filter((cafe) => cafe.id !== cafeId);
                   }
                 })
                 .catch((error) => alert(error));
    };

    return {
      /* Properties */
      cafesUserSubscribedTo,
      sortBy,

      /* Event handlers */
      sortHasChanged,
      unsubscribe,

      /* Icons */
      trashcanOutline,
    };

  },

});
</script>
<style scoped>
ion-item {
  --border-style: none;
  --border-radius: 15px;
  border-top-right-radius: 15px !important;
  border-bottom-right-radius: 15px !important;
}

ion-item-options {
  --border-style: none;
  background-color: #E01B43 !important;
  border-top-right-radius: 15px !important;
  border-bottom-right-radius: 15px !important;
}

ion-item-option {
  --border-style: none;
  --background: #E01B43;
  border-top-right-radius: 15px !important;
  border-bottom-right-radius: 15px !important;
}

ion-item-option:active {
  --background: #E01B43;
}
</style>