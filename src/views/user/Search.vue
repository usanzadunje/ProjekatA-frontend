<template>
  <ion-page>
    <div
        id="header"
    >
      <UserHeader
          :mainHeading="$t('search')"
          :notificationIcon="notificationsOffOutline"
          :searchTerm="cafeSearchString"
          @searchFilterChanged="searchFilterChanged"
      >
        <SlidingFilter :hasTitle="true" @sortHasChanged="sortHasChanged"/>
      </UserHeader>
    </div>

    <ion-content ref="content" :scroll-events="true" @ionScroll="pullAnimation($event)" class="ion-padding">
      <InfiniteScroll
          :cafeSearchString="cafeSearchString"
          :sortBy="sortBy"
          @scrollToTop="scrollToTop"
          @openCafeModal="openModal(true, $event)"
          @infiniteScrollToggle="infiniteScrollLoading = !infiniteScrollLoading"
      />

      <ion-modal
          :is-open="isModalOpen"
          css-class="custom-modal"
          @didDismiss="openModal(false);"
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
import { defineComponent, ref } from 'vue';
import { useRoute, useRouter }  from 'vue-router';
import {
  IonContent,
  IonPage,
  IonModal,
  onIonViewWillEnter,
  onIonViewDidEnter,
  onIonViewWillLeave,
}
                                from '@ionic/vue';

import UserHeader     from '@/components/user/UserHeader';
import SlidingFilter  from '@/components/user/SlidingFilter';
import InfiniteScroll from '@/components/InfiniteScroll';
import ShortCafeModal from '@/components/user/ShortCafeModal';

import { useModal } from '@/composables/useModal';

import { notificationsOffOutline } from 'ionicons/icons';


export default defineComponent({
  name: 'Search',
  components: {
    IonContent,
    IonPage,
    IonModal,
    UserHeader,
    SlidingFilter,
    InfiniteScroll,
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

    /* Composables */
    const { isModalOpen, modalCafe, openModal, hideModal } = useModal();

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
    onIonViewWillLeave(() => {
      // Before leaving page remove search input value and clear search string
      document.querySelector('ion-searchbar div input').value = null;
      cafeSearchString.value = '';
    });

    /* Event handlers */
    const searchFilterChanged = (searchInputValue) => {
      cafeSearchString.value = searchInputValue;
    };
    const sortHasChanged = async(sortValue) => {
      sortBy.value = sortValue;
    };
    const pullAnimation = async(event) => {
      if(infiniteScrollLoading.value){
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
      modalCafe,
      infiniteScrollLoading,

      /* Event handlers */
      searchFilterChanged,
      sortHasChanged,
      pullAnimation,
      openModal,
      hideModal,

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
