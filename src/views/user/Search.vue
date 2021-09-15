<template>
  <ion-page>


    <ion-content ref="content" :scroll-events="true" @ionScroll="pullAnimation($event)">
      <ion-refresher pull-max="100" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>

      <div
          id="header"
      >
        <UserHeader
            :main-heading="$t('search')"
            :notification-icon="notificationsOffOutline"
            :search-term="cafeSearchString"
            @search-filter-changed="searchFilterChanged"
        >
          <SlidingFilter :has-title="true" @sort-has-changed="sortHasChanged"/>
        </UserHeader>
      </div>


      <div class="ion-padding">
        <InfiniteScroll
            :cafe-search-string="cafeSearchString"
            :sort-by="sortBy"
            @scroll-to-top="scrollToTop"
            @open-cafe-modal="openModal(true, $event)"
            @infinite-scroll-toggle="infiniteScrollLoading = !infiniteScrollLoading"
            :refresher="refresher"
        />
      </div>

      <Modal
          :is-open="isModalOpen"
          css-class="custom-modal"
          @didDismiss="openModal(false);"
      >
        <ShortCafeModal
            :cafe="modalData"
            @dismiss-short-cafe-modal="openModal(false)"
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

import UserHeader     from '@/components/user/headers/UserHeader';
import SlidingFilter  from '@/components/user/SlidingFilter';
import InfiniteScroll from '@/components/place/InfiniteScroll';
import Modal          from '@/components/Modal';
import ShortCafeModal from '@/components/user/modals/ShortCafeModal';

import { useModal } from '@/composables/useModal';

import { notificationsOffOutline } from 'ionicons/icons';


export default defineComponent({
  name: 'Search',
  components: {
    IonContent,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    UserHeader,
    SlidingFilter,
    InfiniteScroll,
    Modal,
    ShortCafeModal,
  },
  setup() {
    /* Global properties */
    const route = useRoute();
    const router = useRouter();

    /* Component properties */
    const content = ref(null);
    const cafeSearchString = ref('');
    const sortBy = ref('distance');
    const scrollTopOffset = ref(0);
    const prevScrollDirectionDown = ref(false);
    const infiniteScrollLoading = ref(false);
    const refresher = ref({
      isActive: false,
      event: null,
    });

    /* Composables */
    const { isModalOpen, modalData, openModal, hideModal } = useModal();

    /* Lifecycle hooks */
    onIonViewWillEnter(() => {
      // Before enterning vuew check if there is search term if there is
      // Set search input to search term passed from Home page
      // And remove query string
      if(route.query.searchTerm || route.query.searchTerm === '') {
        cafeSearchString.value = route.query.searchTerm;
        router.replace();
      }
    });
    onIonViewDidEnter(() => {
      openModal(!!route.query.openModal);
    });
    //Uncomment this if it is better to clear input every time after user leaves search page.
    // onIonViewWillLeave(() => {
    //   // Before leaving page remove search input value and clear search string
    //   document.querySelector('ion-searchbar div input').value = null;
    //   cafeSearchString.value = '';
    // });

    /* Event handlers */
    const searchFilterChanged = (searchInputValue) => {
      cafeSearchString.value = searchInputValue;
    };
    const sortHasChanged = async(sortValue) => {
      sortBy.value = sortValue;
    };
    const pullAnimation = async(event) => {
      if(infiniteScrollLoading.value) {
        return;
      }
      let currentScrollDirectionDown = event.detail.currentY > scrollTopOffset.value;
      const header = document.querySelector('#header');
      if(
          event.detail.currentY <= 0 ||
          event.detail.currentY === scrollTopOffset.value ||
          currentScrollDirectionDown === prevScrollDirectionDown.value
      ) {
        scrollTopOffset.value = event.detail.currentY;

        return;
      }

      if(event.detail.currentY > scrollTopOffset.value) {
        header.classList.add('hide-header');
      }else {
        header.classList.remove('hide-header');
      }

      scrollTopOffset.value = event.detail.currentY;
      prevScrollDirectionDown.value = currentScrollDirectionDown;
    };
    const refresh = async(event) => {
      refresher.value.isActive = true;
      refresher.value.event = event;
    };

    /* Methods */
    // When search term is changed infinity scroll component changes data and
    // this function scrolls user back to top to see new filtered data from start
    const scrollToTop = () => {
      content.value?.$el.scrollToTop(500);
    };

    return {
      /* Component properties */
      cafeSearchString,
      sortBy,
      content,
      isModalOpen,
      modalData,
      infiniteScrollLoading,
      refresher,

      /* Event handlers */
      searchFilterChanged,
      sortHasChanged,
      pullAnimation,
      openModal,
      hideModal,
      refresh,

      /* Methods */
      scrollToTop,

      /* Icons from */
      notificationsOffOutline,
    };
  },
});
</script>
<style scoped>
.hide-header {
  display: none;
}
</style>
