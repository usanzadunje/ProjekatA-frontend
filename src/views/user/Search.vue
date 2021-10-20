<template>
  <ion-page>
    <ion-content
        ref="content"
        :scroll-events="true"
        @ionScroll="pullAnimation($event)"
    >
      <ion-refresher pull-max="100" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>

      <div id="header">
        <UserHeader
            :main-heading="$t('search')"
            :search-term="placeSearchTerm"
            @search-filter-changed="searchFilterChanged"
        >
          <SlidingFilter
              :has-title="true"
              @sort-has-changed="sortHasChanged"
              v-if="showSwiper"
          />
        </UserHeader>
      </div>


      <div class="ion-padding">
        <InfinitePlaceScroll
            :place-search-term="placeSearchTerm"
            :sort-by="sortBy"
            @scroll-to-top="scrollToTop(this.$refs.content)"
            @open-place-modal="openModal(true, $event)"
            @infinite-scroll-toggle="infiniteScrollLoading = !infiniteScrollLoading"
            :refresher="refresher"
            @mounted="renderSwiper"
        />
      </div>

      <Modal
          :is-open="isModalOpen"
          css-class="custom-modal"
          @didDismiss="openModal(false);"
      >
        <PlaceInfoModal
            :place="modalData"
            @dismiss-place-info-modal="openModal(false)"
            @sub-modal-opened="hideModal('custom-modal')"
        />
      </Modal>
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

import UserHeader          from '@/components/user/headers/UserHeader';
import SlidingFilter       from '@/components/user/SlidingFilter';
import InfinitePlaceScroll from '@/components/place/InfinitePlaceScroll';
import Modal               from '@/components/Modal';
import PlaceInfoModal      from '@/components/user/modals/PlaceInfoModal';

import { useModal }   from '@/composables/useModal';
import { useContent } from '@/composables/useContent';


export default defineComponent({
  name: 'Search',
  components: {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    UserHeader,
    SlidingFilter,
    InfinitePlaceScroll,
    Modal,
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
    // const scrollTopOffset = ref(0);
    // const prevScrollDirectionDown = ref(false);
    const infiniteScrollLoading = ref(false);
    const refresher = ref({
      isActive: false,
      event: null,
    });
    const showSwiper = ref(false);

    /* Composables */
    const { isModalOpen, modalData, openModal, hideModal } = useModal();
    const { scrollToTop } = useContent();

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
    const pullAnimation = async() => {
      // console.log('active');
      // if(infiniteScrollLoading.value) {
      //   return;
      // }
      // let currentScrollDirectionDown = event.detail.currentY > scrollTopOffset.value;
      // const header = document.querySelector('#header');
      // if(
      //     event.detail.currentY <= 0 ||
      //     event.detail.currentY === scrollTopOffset.value ||
      //     currentScrollDirectionDown === prevScrollDirectionDown.value
      // ) {
      //   scrollTopOffset.value = event.detail.currentY;
      //
      //   return;
      // }
      //
      // if(event.detail.currentY > scrollTopOffset.value) {
      //   header.classList.add('hide-header');
      // }else {
      //   header.classList.remove('hide-header');
      // }
      //
      // scrollTopOffset.value = event.detail.currentY;
      // prevScrollDirectionDown.value = currentScrollDirectionDown;
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

      /* Event handlers */
      searchFilterChanged,
      sortHasChanged,
      pullAnimation,
      openModal,
      hideModal,
      refresh,
      renderSwiper,

      /* Methods */
      scrollToTop,

      /* Icons from */
    };
  },
});
</script>
<style scoped>
.hide-header {
  display: none;
}
</style>
