<template>
  <ion-page>
    <UserHeader
        :mainHeading="'Pronadji slobodno mesto'"
        :notificationIcon="notificationsOutline"
        @searchEnterPressed="switchToSearch"
    />

    <ion-content class="ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            pulling-text="Povuci te da osvezite"
            refreshing-spinner="lines"
            refreshing-text="Osvezava se..."
        >
        </ion-refresher-content>
      </ion-refresher>
      <FilterCategoryHeading class="mb-2" :title="'Najblizi vama'"/>
      <ion-slides v-show="!showSkeleton" :options="slideOpts" class="homeSlider">
        <ion-slide>
          <HomeSlidingCafeCards
              :cafes="cafes.closestToUserCafes.slice(0, 2)"
              @openCafeModal="openModal($event, true)"
              class="pr-3"
          />
        </ion-slide>
        <ion-slide>
          <HomeSlidingCafeCards
              :cafes="cafes.closestToUserCafes.slice(2, 4)"
              @openCafeModal="openModal($event, true)"
              class="pr-3"
          />
        </ion-slide>
      </ion-slides>

      <div v-if="showSkeleton">
        <SkeletonCafeCard class="mb-2"></SkeletonCafeCard>
        <SkeletonCafeCard class="mb-2"></SkeletonCafeCard>
      </div>

      <FilterCategoryHeading class="mb-2" :title="'Trenutno slobodni'"/>
      <ion-slides v-show="!showSkeleton" :options="slideOpts" class="homeSlider">
        <ion-slide>
          <HomeSlidingCafeCards
              :cafes="cafes.currentlyAvailableCafes.slice(0, 2)"
              @openCafeModal="openModal($event, true)"
              class="pr-3"
          />
        </ion-slide>
        <ion-slide>
          <HomeSlidingCafeCards
              :cafes="cafes.currentlyAvailableCafes.slice(2, 4)"
              @openCafeModal="openModal($event, true)"
              class="pr-3"
          />
        </ion-slide>
      </ion-slides>

      <div v-if="showSkeleton">
        <SkeletonCafeCard class="mb-2"></SkeletonCafeCard>
        <SkeletonCafeCard></SkeletonCafeCard>
      </div>

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
import { defineComponent, ref, reactive, onMounted } from 'vue';

import { useRouter } from 'vue-router';

import {
  IonContent,
  IonPage,
  IonModal,
  IonSlides,
  IonSlide,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/vue';

import CafeService from '@/services/CafeService';

import UserHeader            from '@/components/user/UserHeader';
import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import HomeSlidingCafeCards  from '@/components/user/HomeSlidingCafeCards';
import ShortCafeModal        from '@/components/user/ShortCafeModal';
import SkeletonCafeCard      from '@/components/user/SkeletonCafeCard';

import { notificationsOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonModal,
    IonSlides,
    IonSlide,
    IonRefresher,
    IonRefresherContent,
    UserHeader,
    FilterCategoryHeading,
    HomeSlidingCafeCards,
    ShortCafeModal,
    SkeletonCafeCard,
  },
  beforeRouteEnter(to) {
    // Before entering route remove query params
    if(Object.keys(to.query).length) {
      return { path: to.path, query: {}, hash: to.hash };
    }
  },
  setup() {
    /* Global properties */
    const router = useRouter();

    /* Component properties */
    const slideOpts = {
      initialSlide: 0,
      speed: 300,
      slidesPerView: 1.1,
    };
    // Cafes closest to user
    let cafes = reactive({
      currentlyAvailableCafes: [],
      closestToUserCafes: [],
    });
    // Showing/Hiding modal based on this property value
    const isModalOpen = ref(false);
    // Cafe which information is sent to modal
    const modalCafe = ref({});
    let showSkeleton = ref(true);

    /* Lifecycle hooks */
    // Without this on android options are not passed to swiper
    onMounted(() => {
      if(showSkeleton.value) {
        const slides = document.getElementsByClassName("homeSlider");
        setTimeout(() => {
          slides.forEach((slide) => {
            slide.options = slideOpts;
            slide.update();
          });
        }, 200);
      }
    });
    //*Before mounting fetching initial 4 cafes to show in currently free cafes
    CafeService.getCafeCardsChunkInfo(0, 4, '', 'id', true)
               .then((response) => {
                 cafes.currentlyAvailableCafes = response.data;
               })
               .catch((error) => alert(JSON.stringify(error)));

    //*Before mounting fetching initial 4 cafes to show closest to user
    CafeService.getCafeCardsChunkInfo(0, 4, '', 'name', true)
               .then((response) => {
                 cafes.closestToUserCafes = response.data;
                 showSkeleton.value = false;
               })
               .catch((error) => alert(JSON.stringify(error)));

    /* Event handlers */
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
    const switchToSearch = (e) => {
      router.push({ path: 'search', query: { searchTerm: e.target.value } });
      //Clearing search input after leaving page
      e.target.value = null;
    };
    const refresh = (event) => {
      // Only after both cafe arrays have been updated then complete refresher
      // Fetching 4 cafes in each category with new live data
      Promise.all([
        CafeService.getCafeCardsChunkInfo(0, 4, '', 'name', true)
                   .then((response) => {
                     cafes.currentlyAvailableCafes = response.data;
                   })
                   .catch((error) => alert(JSON.stringify(error))),

        CafeService.getCafeCardsChunkInfo(0, 4, '', 'id', true)
                   .then((response) => {
                     cafes.closestToUserCafes = response.data;
                   })
                   .catch((error) => alert(JSON.stringify(error))),
      ])
             .then(() => {
               event.target.complete();
             })
             .catch((error) => {
               alert(JSON.stringify(error));
               event.target.complete();
             });


    };

    return {
      /* Global properties */

      /* Component properties */
      slideOpts,
      cafes,
      isModalOpen,
      modalCafe,
      showSkeleton,

      /* Event handlers */
      openModal,
      hideModal,
      switchToSearch,
      refresh,

      /* Methods */

      /* Icons from */
      notificationsOutline,
    };
  },
});
</script>
<style>
ion-refresher {
  background: #F6F7FB !important;
}

ion-refresher-content {
  margin-top: 3px !important;
}
</style>
