<template>
  <ion-page>
    <div
        id="header"
        class="pull-transition"
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

    <ion-content ref="content" :scroll-events="true" @ionScroll="pullAnimation()" class="ion-padding">
      <InfiniteScroll
          :cafeSearchString="cafeSearchString"
          :sortBy="sortBy"
          @scrollToTop="scrollToTop"
          @openCafeModal="openModal(true, $event)"
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
import { defineComponent, onMounted, ref } from 'vue';

import {
  IonContent,
  IonPage,
  IonModal,
}
  from '@ionic/vue';

import UserHeader     from '@/components/user/UserHeader';
import SlidingFilter  from '@/components/user/SlidingFilter';
import InfiniteScroll from '@/components/InfiniteScroll';
import ShortCafeModal from '@/components/user/ShortCafeModal';

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
  // beforeRouteEnter(to) {
  //   // Before entering route remove query params
  //   // if(Object.keys(to.query).length) {
  //   //   return { path: to.path, query: {}, hash: to.hash };
  //   // }
  // },
  ionViewWillEnter() {
    // Before enterning vuew check if there is search term if there is
    // Set search input to search term passed from Home page
    // And remove query string
    if(this.$route.query.searchTerm || this.$route.query.searchTerm === '') {
      this.cafeSearchString = this.$route.query.searchTerm;
      this.$router.replace();
    }
  },
  ionViewDidEnter() {
    let shouldOpenModal = !!this.$route.query.openModal;
    this.openModal(shouldOpenModal);
  },
  ionViewWillLeave() {
    // Before leaving page remove search input value and clear search string
    document.querySelector('ion-searchbar div input').value = null;
    this.cafeSearchString = '';
  },
  setup() {
    /* Component references */
    const content = ref(null);

    /* Component properties */
    const cafeSearchString = ref('');
    const sortBy = ref('distance');
    let scrollTopOffset = ref(0);
    // Showing/Hiding modal based on this property value
    const isModalOpen = ref(false);
    // Cafe which information is sent to modal
    const modalCafe = ref({});
    const slideOpts = {
      initialSlide: 0,
      speed: 500,
      centeredSlides: false,
      slidesPerView: 2.7,
    };

    /* Methods */

    /* Lifecycle hooks */
    //Setting options for slider inside SlideFilter component
    onMounted(async() => {
      const slides = document.getElementsByClassName('filterSlider');
      slides.forEach((slide) => {
        slide.options = slideOpts;
        slide.update();
      });
    });

    /* Event handlers */
    const searchFilterChanged = (searchInputValue) => {
      cafeSearchString.value = searchInputValue;
    };
    const sortHasChanged = async(sortValue) => {
      sortBy.value = sortValue;
    };
    const pullAnimation = async() => {
      let scrollElement = await content.value?.$el.getScrollElement();

      if(scrollElement.scrollTop > scrollTopOffset.value) {
        document.querySelector('#header').classList.add('hide-header');
      }else {
        document.querySelector('#header').classList.remove('hide-header');
      }

      scrollTopOffset.value = scrollElement.scrollTop;
    };
    const openModal = (state, cafe = null) => {
      if(cafe) {
        modalCafe.value = cafe;
      }
      isModalOpen.value = state;
    };
    const hideModal = () => {
      const modal = document.querySelector('.custom-modal > .modal-wrapper');

      modal.style.height = 0;
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
      slideOpts,

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
  margin-top: -266px !important;
}

.pull-transition {
  transition: all 0.5s ease-in;
}
</style>
