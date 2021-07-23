<template>
  <ion-page>
    <UserProfileHeader/>

    <ion-content class="ion-padding no-padding-top">
      <SlidingFilter @sortHasChanged="sortHasChanged" class="mt-2"/>

      <div class="mt-3">
        <FilterCategoryHeading title="Kafici koje pratim" class="mb-2"/>

        <div v-if="!showSkeleton">
          <ion-item-sliding v-for="cafe in cafesUserSubscribedTo" :key="cafe.id" class="ion-no-padding mb-5">
            <ion-item class="ion-no-padding ion-no-margin">
              <CafeCard
                  class="w-full"
                  :cafe="cafe"
                  @click="openModal(true, cafe)"
              />
            </ion-item>

            <ion-item-options side="end" @ionSwipe="showAlert(cafe.id)">
              <ion-item-option type="button" @click="showAlert(cafe.id)">
                <ion-icon
                    slot="icon-only"
                    :icon="trashOutline"
                    class="text-2xl"
                ></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </div>

        <div v-if="showSkeleton">
          <div v-for="i in 5" :key="i" class="mb-5">
            <SkeletonCafeCard></SkeletonCafeCard>
          </div>
        </div>
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
            @userUnsubscribed="removeUnsubscribed"
        />
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';

import { mapGetters, useStore } from 'vuex';

import {
  IonContent,
  IonPage,
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  alertController,
  IonModal,
} from '@ionic/vue';

import UserProfileHeader     from '@/components/user/UserProfileHeader';
import SlidingFilter         from '@/components/user/SlidingFilter';
import FilterCategoryHeading from '@/components/user/FilterCategoryHeading';
import CafeCard              from '@/components/user/CafeCard';
import ShortCafeModal        from '@/components/user/ShortCafeModal';
import SkeletonCafeCard      from '@/components/user/SkeletonCafeCard';

import CafeService from '@/services/CafeService';

import {
  trashOutline,
}                                from 'ionicons/icons';
import { useToastNotifications } from '@/composables/useToastNotifications';
import { useI18n }               from 'vue-i18n';
import { useGeolocation }        from '@/composables/useGeolocation';


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
    IonModal,
    UserProfileHeader,
    SlidingFilter,
    FilterCategoryHeading,
    CafeCard,
    ShortCafeModal,
    SkeletonCafeCard,
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
  },
  ionViewDidEnter() {
    let shouldOpenModal = !!this.$route.query.openModal;
    this.openModal(shouldOpenModal);
    // Everytime user comes to the page give him view of fresh cafes he has subscribed to
    CafeService.getAllCafesUserSubscribedTo(this.sortBy, this.$store.getters['global/position'].latitude, this.$store.getters['global/position'].longitude)
               .then((response) => {
                 this.cafesUserSubscribedTo = response.data;
                 this.showSkeleton = false;
               })
               .catch((error) => console.log(error));

  },
  setup() {
    /* Global properties */
    const store = useStore();
    const { t } = useI18n();

    /* Component properties */
    // Cafes user is subscribed to
    let cafesUserSubscribedTo = ref([]);
    let sortBy = ref('distance');
    const slideOpts = {
      initialSlide: 0,
      speed: 500,
      centeredSlides: false,
      slidesPerView: 2.7,
    };
    // Showing/Hiding modal based on this property value
    const isModalOpen = ref(false);
    // Cafe which information is sent to modal
    const modalCafe = ref({});
    let showSkeleton = ref(true);

    /* Methods */
    const { showSuccessToast } = useToastNotifications();
    const { checkForLocationPermission, tryGettingLocation } = useGeolocation();

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
    const sortHasChanged = async(sortValue) => {
      sortBy.value = sortValue;
      if(sortBy.value === 'distance') {
        await checkForLocationPermission();
      }
      await tryGettingLocation();
      CafeService.getAllCafesUserSubscribedTo(sortValue, store.getters['global/position'].latitude, store.getters['global/position'].longitude)
                 .then((response) => {
                   cafesUserSubscribedTo.value = response.data;
                 })
                 .catch((error) => alert(error));
    };
    const showAlert = async(cafeId) => {
      const alert = await alertController
          .create({
            header: t('alertUnsubscribeHeader'),
            message: t('alertUnsubscribeMessage'),
            buttons: [
              {
                text: t('disagree'),
                role: 'cancel',
              },
              {
                text: t('agree'),
                handler: () => {
                  unsubscribe(cafeId);
                  showSuccessToast(t('successSubscribe'));
                },
              },
            ],
          });
      await alert.present();
    };
    const openModal = async(state, cafe = null) => {
      if(cafe) {
        modalCafe.value = cafe;
      }
      isModalOpen.value = state;
    };

    const unsubscribe = (cafeId) => {
      CafeService.unsubscribe(cafeId)
                 .then((response) => {
                   if(response.data) {
                     cafesUserSubscribedTo.value = cafesUserSubscribedTo.value.filter(cafe => cafe.id !== cafeId);
                   }
                 })
                 .catch((error) => alert(error));
    };
    const removeUnsubscribed = () => {
      CafeService.getAllCafesUserSubscribedTo(sortBy.value, store.getters['global/position'].latitude, store.getters['global/position'].longitude)
                 .then((response) => {
                   cafesUserSubscribedTo.value = response.data;
                 })
                 .catch((error) => alert(error));
    };
    const hideModal = () => {
      const modal = document.querySelector('.custom-modal > .modal-wrapper');

      modal.style.height = 0;
    };

    return {
      /* Component roperties */
      cafesUserSubscribedTo,
      sortBy,
      slideOpts,
      isModalOpen,
      modalCafe,
      showSkeleton,

      /* Event handlers */
      sortHasChanged,
      showAlert,
      openModal,
      removeUnsubscribed,
      hideModal,

      /* Icons */
      trashOutline,
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
  --inner-padding-end: 0;
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

/*ion-content {*/
/*  --padding-top: 0;*/
/*}*/
</style>