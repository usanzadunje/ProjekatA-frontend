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
      <HomeSlidingCafeCards
          :cafes="tableFreeCafes.slice(0)"
          @openCafeModal="openModal($event, true)"/>
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
import { defineComponent, ref, watch }                        from 'vue';
import {
  IonContent,
  IonPage,
  // IonSlides,
  // IonSlide,
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
    // IonSlides,
    // IonSlide,
    IonModal,
    UserHeader,
    FilterCategoryHeading,
    HomeSlidingCafeCards,
    ShortCafeModal,
  },
  setup(props, { emit }) {
    /* Component properties */
    const slides = ref(null);
    const slideOpts = {
      initialSlide: 0,
      speed: 500,
      centeredSlides: true,
      slidesPerView: 1,
      spaceBetween: 16,
    };

    /* Properties */
    // Cafes closest to user
    let tableFreeCafes = ref([]);
    let tests = ref([1, 2, 3]);
    // Cafes closest to user
    let closestCafes = ref([]);
    // Search term for filtering records
    const cafeSearchString = ref('');
    // From which number on to take cafe records
    let cafeStart = 0;

    const isModalOpen = ref(false);
    // Cafe which information is sent to modal
    const modalCafe = ref({});

    //TESTETEST
    const test = () => {
      updateSlider();
      tests.value.push(69);

    };

    /* Lifecycle hooks */
    //*Before mounting fetching initial 2 cafes to show in currently free cafes
    CafeService.getCafeCardsChunkInfo(cafeStart, 2, '', 'id', true)
               .then((response) => {
                 tableFreeCafes.value = response.data;
               })
               .catch((error) => alert(error));

    //*Before mounting fetching initial 2 cafes to show closest to user
    CafeService.getCafeCardsChunkInfo(cafeStart, 2, '', 'id', true)
               .then((response) => {
                 closestCafes.value = response.data;
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

    /* Component methods */
    const updateSlider = async() => {
      await slides?.value?.$el.update();
    };

    /* Methods */

    // Grabbing 20 more cafes that match required filter
    const loadMoreCafes = (cafes, sortBy = '') => {
      cafeStart += 2;
      CafeService.getCafeCardsChunkInfo(cafeStart, 2, cafeSearchString.value, sortBy, true)
                 .then((response) => {
                   // There are no more records
                   if(!response.data) return;
                   // if(response.data.length < 20) isInfiniteScrollDisabled.value = true;
                   cafes.value = cafes.value.concat(response.data);
                 })
                 .catch((error) => alert(error));

    };

    const filterCafes = (cafes, sortBy = '') => {
      CafeService.getCafeCardsChunkInfo(cafeStart, 2, cafeSearchString.value, sortBy.value, true)
                 .then((response) => {
                   if(!response.data) return;
                   // if(response.data.length < 20) isInfiniteScrollDisabled.value = true;
                   cafes = response.data;
                 })
                 .catch((error) => alert(error));

    };


    const computeCafeSlidesLength = (array) => {
      return Math.ceil(array.length / 2);
    };

    /* Watchers */
    // Watching for a change on cafeSearchString(search term from search input) prop
    // resetting all the variables for filtered data and loading first 20 records from new filtered data
    watch(cafeSearchString, () => {
      cafeStart = 0;
      filterCafes(tableFreeCafes);
      emit('swipeToStart');
    });

    return {
      test,
      /* Component specific properties */
      slides,
      slideOpts,
      tests,
      isModalOpen,
      modalCafe,

      /* Properties */
      tableFreeCafes,
      closestCafes,
      cafeStart,


      /* Event handlers */
      searchFilterChanged,
      loadMoreCafes,
      openModal,

      /* Methods */
      computeCafeSlidesLength,

      /* Icons */
      notificationsOutline,
      notificationsReceivedOutline,
    };
  },
});
</script>
