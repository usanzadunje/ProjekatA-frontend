<template>
  <ion-page>
    <AppSlideUpWrapper>
      <TheUserHeader
          id="searchHeader"
          v-show="showElement"
          :main-heading="$t('search')"
          :search-term="placeSearchTerm"
          @search-filter-changed="searchFilterChanged"
      >
        <SlidingFilter
            v-if="showSwiper"
            :has-title="true"
            @sort-has-changed="sortHasChanged"
        />
      </TheUserHeader>
    </AppSlideUpWrapper>

    <ion-content
        ref="content"
        :scroll-events="true"
        @ionScroll="pullAnimation($event)"
        :fullscreen="true"
    >
      <ion-refresher pull-max="100" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>

      <div class="ion-padding">
        <PlaceInfiniteScroll
            :place-search-term="placeSearchTerm"
            :sort-by="sortBy"
            :refresher="refresher"
            @infinite-scroll-toggle="infiniteScrollLoading = !infiniteScrollLoading"
            @mounted="renderSwiper"
            @scroll-to-top="scrollToTop(this.$refs.content)"
            @open-place-modal="openModal(true, $event)"
        />
      </div>

      <AppModal
          :is-open="isModalOpen"
          css-class="custom-modal"
          @didDismiss="openModal(false);"
      >
        <PlaceInfoModal
            :place="modalData"
            @dismiss-place-info-modal="openModal(false)"
            @sub-modal-opened="hideModal('custom-modal')"
        />
      </AppModal>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRoute, useRouter }  from 'vue-router';
import {
  IonContent,
  IonPage,
  onIonViewWillEnter,
  onIonViewDidEnter,
  IonRefresher,
  IonRefresherContent,
  // onIonViewWillLeave,
}
                                from '@ionic/vue';

import AppSlideUpWrapper   from '@/components/AppSlideUpWrapper';
import TheUserHeader       from '@/components/user/headers/TheUserHeader';
import SlidingFilter       from '@/components/user/SlidingFilter';
import PlaceInfiniteScroll from '@/components/place/PlaceInfiniteScroll';
import AppModal            from '@/components/AppModal';
import PlaceInfoModal      from '@/components/user/modals/PlaceInfoModal';

import { useModal }   from '@/composables/useModal';
import { useContent } from '@/composables/useContent';
import { slideUp }    from '@/composables/useAnimations';


export default defineComponent({
  name: 'PlaceSearch',
  components: {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    AppSlideUpWrapper,
    TheUserHeader,
    SlidingFilter,
    PlaceInfiniteScroll,
    AppModal,
    PlaceInfoModal,
  },
  setup() {
    /* Global properties */
    const route = useRoute();
    const router = useRouter();

    /* Component properties */
    const content = ref();
    const placeSearchTerm = ref('');
    const sortBy = ref('distance');
    const infiniteScrollLoading = ref(false);
    const refresher = ref({
      isActive: false,
      event: null,
    });
    const showSwiper = ref(false);

    /* Composables */
    const { isModalOpen, modalData, openModal, hideModal } = useModal();
    const { scrollToTop } = useContent();
    const { showElement, pullAnimation } = slideUp('searchHeader');

    /* Lifecycle hooks */
    onIonViewWillEnter(() => {
      // Before entering view check if there is search term if there is
      // Set search input to search term passed from Home page
      // And remove query string
      if(route.query.searchTerm || route.query.searchTerm === '') {
        placeSearchTerm.value = route.query.searchTerm;
        router.replace();
      }
    });
    onIonViewDidEnter(() => {
      openModal(!!route.query.openModal);
    });
    //Uncomment this if it is better to clear input every time after users leaves search page.
    // onIonViewWillLeave(() => {
    //   // Before leaving page remove search input value and clear search string
    //   document.querySelector('ion-searchbar div input').value = null;
    //   placeSearchTerm.value = '';
    // });

    /* Event handlers */
    const searchFilterChanged = (searchInputValue) => {
      placeSearchTerm.value = searchInputValue;
    };
    const sortHasChanged = async(sortValue) => {
      sortBy.value = sortValue;
    };
    const refresh = async(event) => {
      refresher.value.isActive = true;
      refresher.value.event = event;
    };

    const renderSwiper = () => {
      showSwiper.value = true;
    };
    /* Methods */
    // When search term is changed infinity scroll component changes data and
    // this function scrolls users back to top to see new filtered data from start

    return {
      /* Component properties */
      placeSearchTerm,
      sortBy,
      content,
      isModalOpen,
      modalData,
      infiniteScrollLoading,
      refresher,
      showSwiper,
      showElement,

      /* Event handlers */
      searchFilterChanged,
      sortHasChanged,
      openModal,
      hideModal,
      refresh,
      renderSwiper,
      pullAnimation,

      /* Methods */
      scrollToTop,

      /* Icons from */
    };
  },
});
</script>
<style scoped>
/*.hide-header {*/
/*  display: none;*/
/*}*/
</style>
