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
      <ion-slides
          :options="slideOpts"
          ref="availableCafeSlides"
          @ionSlideDidChange="loadMoreCafes('currentlyAvailableCafes')"
      >
        <ion-slide v-for="i in cafeSlidesLength" :key="i">
          <HomeSlidingCafeCards
              :cafes="cafes.currentlyAvailableCafes.slice(0, 2)"
              @openCafeModal="openModal($event, true)"
          />
        </ion-slide>
      </ion-slides>

      <FilterCategoryHeading class="mb-2" :title="'Najblizi vama'"/>
      <ion-slides
          :options="slideOpts"
          ref="closestCafeSlides"
      >
        <ion-slide v-for="i in [0, 2, 4]" :key="i">
          <!--          <HomeSlidingCafeCards-->
          <!--              :cafes="cafes.closestToUserCafes.slice(0)"-->
          <!--              @openCafeModal="openModal($event, true)"-->
          <!--          />-->
        </ion-slide>
      </ion-slides>


      <ion-modal
          :is-open="isModalOpen"
          css-class="custom-modal"
          @onDidDismiss="openModal(false);"
          :backdrop-dismiss="true"
          :swipe-to-close="true"
      >
        <ShortCafeModal
            :cafe="modalCafe"
            @dismissShortCafeModal="openModal(false)"/>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, reactive, watch }              from 'vue';
import {
  IonContent,
  IonPage,
  IonSlides,
  IonSlide,
  IonModal,
}                                                             from '@ionic/vue';
import UserHeader                                             from '@/components/user/UserHeader';
import CafeService                                            from '@/services/CafeService';
import { notificationsOutline, notificationsReceivedOutline } from '@/assets/icons';
import FilterCategoryHeading                                  from '@/components/user/FilterCategoryHeading';
import HomeSlidingCafeCards                                   from '@/components/user/HomeSlidingCafeCards';
import ShortCafeModal                                         from '@/components/user/ShortCafeModal';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonSlides,
    IonSlide,
    IonModal,
    UserHeader,
    FilterCategoryHeading,
    HomeSlidingCafeCards,
    ShortCafeModal,
  },
  setup() {
    /* Component properties */
    const availableCafeSlides = ref(null);
    const closestCafeSlides = ref(null);
    const slideOpts = {
      initialSlide: 0,
      speed: 500,
      centeredSlides: true,
      slidesPerView: 1,
      spaceBetween: 16,
    };

    /* Properties */
    // Cafes closest to user
    let cafes = reactive({
      currentlyAvailableCafes: [],
      closestToUserCafes: [],
    });

    let cafeSlidesLength = ref(2);

    // Search term for filtering records
    const cafeSearchString = ref('');
    // From which number on to take cafe records
    let cafeStart = 0;

    const isModalOpen = ref(false);
    // Cafe which information is sent to modal
    const modalCafe = ref({});

    /* Lifecycle hooks */
    //*Before mounting fetching initial 4 cafes to show in currently free cafes
    CafeService.getCafeCardsChunkInfo(cafeStart, 4, '', 'id', true)
               .then((response) => {
                 cafes.currentlyAvailableCafes = response.data;
               })
               .catch((error) => alert(error));

    //*Before mounting fetching initial 4 cafes to show closest to user
    CafeService.getCafeCardsChunkInfo(cafeStart, 4, '', 'name', true)
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


    // Grabbing 2 more cafes that match required filter
    const loadMoreCafes = async(cafeArrayName, sortBy = '') => {
      //Only load more cafes if user is on last slide
      if(await availableCafeSlides?.value?.$el.isEnd() || await closestCafeSlides?.value?.$el.isEnd()) {
        cafeStart += 4;
        CafeService.getCafeCardsChunkInfo(cafeStart, 4, cafeSearchString.value, sortBy, true)
                   .then((response) => {
                     // There are no more records
                     if(!response.data) return;
                     // if(response.data.length < 20) isInfiniteScrollDisabled.value = true;
                     cafes[cafeArrayName] = cafes[cafeArrayName].concat(response.data);
                   })
                   .catch((error) => {
                     alert(error);
                   });
      }
    };

    const filterCafes = () => {
      CafeService.getCafeCardsChunkInfo(cafeStart, 4, cafeSearchString.value, 'id', true)
                 .then((response) => {
                   if(!response.data) return;
                   // if(response.data.length < 20) isInfiniteScrollDisabled.value = true;
                   cafes.currentlyAvailableCafes = response.data;
                 })
                 .catch((error) => alert(error));

      CafeService.getCafeCardsChunkInfo(cafeStart, 4, cafeSearchString.value, 'name', true)
                 .then((response) => {
                   if(!response.data) return;
                   // if(response.data.length < 20) isInfiniteScrollDisabled.value = true;
                   cafes.closestToUserCafes = response.data;
                 })
                 .catch((error) => alert(error));

    };

    /* Watchers */
    // Watching for a change on cafeSearchString(search term from search input) prop
    // resetting all the variables for filtered data and loading first 20 records from new filtered data
    watch(cafeSearchString, () => {
      cafeStart = 0;
      filterCafes();
      availableCafeSlides?.value?.$el.slideTo(0);
    });

    return {
      /* Component specific properties */
      availableCafeSlides,
      closestCafeSlides,
      slideOpts,
      isModalOpen,
      modalCafe,

      /* Properties */
      cafes,
      cafeSlidesLength,
      cafeStart,


      /* Event handlers */
      searchFilterChanged,
      loadMoreCafes,
      openModal,

      /* Methods */

      /* Icons */
      notificationsOutline,
      notificationsReceivedOutline,
    };
  },
});
</script>
