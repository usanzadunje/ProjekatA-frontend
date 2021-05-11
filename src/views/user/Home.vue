<template>
  <ion-page>
    <UserHeader
        :hasSearchFilter="true"
        :mainHeading="'Pronadji slobodno mesto'"
        :notificationIcon="notificationsOutline"
        @searchFilterChanged="searchFilterChanged"
    />

    <ion-content class="ion-padding">
      <FilterCategoryHeading class="mb-2" :title="'Trenutno slobodni'"/>
      <swiper
          ref="availableCafesSwiper"
          :slides-per-view="1.1"
          @slideChange="loadMoreCafes($event, 'currentlyAvailableCafes', 'id')"
      >
        <swiper-slide v-for="i in cafeSlidesLength.currentlyAvailableCafes" :key="i">
          <HomeSlidingCafeCards
              :cafes="cafes.currentlyAvailableCafes.slice(i, i + 2)"
              @openCafeModal="openModal($event, true)"
              class="pr-3"
          />
        </swiper-slide>
      </swiper>


      <FilterCategoryHeading class="mb-2" :title="'Najblizi vama'"/>
      <swiper
          ref="closestCafesSwiper"
          :slides-per-view="1.1"
          @slideChange="loadMoreCafes($event, 'closestToUserCafes', 'name')"
      >
        <swiper-slide v-for="i in cafeSlidesLength.closestToUserCafes" :key="i">
          <HomeSlidingCafeCards
              :cafes="cafes.closestToUserCafes.slice(i, i + 2)"
              @openCafeModal="openModal($event, true)"
              class="pr-3"
          />
        </swiper-slide>
      </swiper>

      <ion-modal
          :is-open="isModalOpen"
          css-class="custom-modal"
          @onDidDismiss="openModal(false);"
          :backdrop-dismiss="true"
          :swipe-to-close="true"
      >
        <ShortCafeModal
            :cafe="modalCafe"
            @dismissShortCafeModal="openModal(false)"
            @subModalOpened="hideModal"
        />
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, reactive, watch } from 'vue';
import {
  IonContent,
  IonPage,
  IonModal,
}                                                           from '@ionic/vue';
import UserHeader                                           from '@/components/user/UserHeader';
import CafeService                                          from '@/services/CafeService';
import FilterCategoryHeading                                from '@/components/user/FilterCategoryHeading';
import HomeSlidingCafeCards                                 from '@/components/user/HomeSlidingCafeCards';
import ShortCafeModal                                       from '@/components/user/ShortCafeModal';

import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/swiper.min.css';

import { notificationsOutline, notificationsReceivedOutline } from '@/assets/icons';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonModal,
    UserHeader,
    FilterCategoryHeading,
    HomeSlidingCafeCards,
    ShortCafeModal,
    Swiper,
    SwiperSlide,
  },
  setup() {
    /* Component references */
    const availableCafesSwiper = ref(null);
    const closestCafesSwiper = ref(null);

    /* Properties */
    // Cafes closest to user
    let cafes = reactive({
      currentlyAvailableCafes: [],
      closestToUserCafes: [],
    });

    const cafeSlidesLength = reactive({
      currentlyAvailableCafes: [0, 2],
      closestToUserCafes: [0, 2],
    });

    // Search term for filtering records
    const cafeSearchString = ref('');
    // From which number on to take cafe records
    let cafeStart = reactive({
      currentlyAvailableCafes: 4,
      closestToUserCafes: 4,
    });

    const isModalOpen = ref(false);
    // Cafe which information is sent to modal
    const modalCafe = ref({});

    /* Lifecycle hooks */
    //*Before mounting fetching initial 4 cafes to show in currently free cafes
    CafeService.getCafeCardsChunkInfo(0, 4, '', 'id', true)
               .then((response) => {
                 cafes.currentlyAvailableCafes = response.data;
               })
               .catch((error) => alert(error));

    //*Before mounting fetching initial 4 cafes to show closest to user
    CafeService.getCafeCardsChunkInfo(0, 4, '', 'name', true)
               .then((response) => {
                 cafes.closestToUserCafes = response.data;
               })
               .catch((error) => alert(error));

    /* Event handlers */
    const searchFilterChanged = (searchInputValue) => {
      cafeSearchString.value = searchInputValue;
    };
    const openModal = (cafe = null, state) => {
      if(cafe) {
        modalCafe.value = cafe;
      }
      isModalOpen.value = state;
    };
    const hideModal = () => {
      const modal = document.querySelector('.custom-modal > .modal-wrapper');

      modal.style.height = 0;
    };


    // Grabbing 2 more cafes that match required filter
    const loadMoreCafes = (e, cafeArrayName, sortBy = '') => {
      CafeService.getCafeCardsChunkInfo(cafeStart[cafeArrayName], 2, cafeSearchString.value, sortBy, true)
                 .then((response) => {
                   // There are no more records
                   if(response.data.length === 0) return;
                   // if(response.data.length < 20) isInfiniteScrollDisabled.value = true;
                   cafes[cafeArrayName] = cafes[cafeArrayName].concat(response.data);
                   cafeSlidesLength[cafeArrayName].push(cafeSlidesLength[cafeArrayName][cafeSlidesLength[cafeArrayName].length - 1] + 2);
                 })
                 .catch((error) => {
                   alert(error);
                 });
      cafeStart[cafeArrayName] += 2;
    };

    const filterCafes = () => {
      CafeService.getCafeCardsChunkInfo(0, 4, cafeSearchString.value, 'id', true)
                 .then((response) => {
                   if(response.data.length === 0) return;
                   cafes.currentlyAvailableCafes = response.data;
                   cafeStart.currentlyAvailableCafes = 4;
                   cafeSlidesLength.currentlyAvailableCafes = response.data.length === 1 ? [0] : [0, 2];
                 })
                 .catch((error) => alert(error));

      CafeService.getCafeCardsChunkInfo(0, 4, cafeSearchString.value, 'name', true)
                 .then((response) => {
                   if(response.data.length === 0) return;
                   cafes.closestToUserCafes = response.data;
                   cafeStart.closestToUserCafes = 4;
                   cafeSlidesLength.closestToUserCafes = response.data.length === 1 ? [0] : [0, 2];
                 })
                 .catch((error) => alert(error));
    };

    /* Watchers */
    // Watching for a change on cafeSearchString(search term from search input) prop
    // resetting all the variables for filtered data and loading first 20 records from new filtered data
    watch(cafeSearchString, () => {
      filterCafes();
      availableCafesSwiper.value.$el.swiper.slideTo(0);
      closestCafesSwiper.value.$el.swiper.slideTo(0);
    });

    return {
      /* Component references */
      availableCafesSwiper,
      closestCafesSwiper,

      /* Properties */
      cafes,
      cafeSlidesLength,
      cafeStart,
      isModalOpen,
      modalCafe,

      /* Event handlers */
      searchFilterChanged,
      loadMoreCafes,
      openModal,
      hideModal,

      /* Methods */

      /* Icons */
      notificationsOutline,
      notificationsReceivedOutline,
    };
  },
});
</script>
<style>
div.swiper-slide {
  width: 90%;
}
</style>
