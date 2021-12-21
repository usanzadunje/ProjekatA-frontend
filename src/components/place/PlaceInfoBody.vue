<template>
  <div>
    <div
        v-show="!showSkeleton"
        class="flex justify-start items-center py-2 ion-item-no-padding-x mt-2"
    >
      <ion-icon :icon="pieChart" class="mr-2 text-yellow-400" style="font-size: 25px"></ion-icon>
      <span class="modal-cafe-text-medium lowercase">{{ freeSeats }} - {{ $t('availableSeats') }}</span>
    </div>
    <ion-skeleton-text
        v-show="showSkeleton"
        animated
        class="h-6 w-48 rounded-md mt-2"
    ></ion-skeleton-text>
    <hr class="card-horizontal-ruler mt-1">
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <ion-icon :icon="locationOutline" class="flex-shrink-0 mr-2 primary-icon-color text-lg"></ion-icon>
        <p class="modal-cafe-text-regular flex-shrink">{{ place.address }} - {{ place.city }}</p>
      </div>
      <ion-button @click="openModal(true)" fill="clear" class="uppercase font-bold user-selected-color">
        {{ $t('map') }}
      </ion-button>
    </div>
    <hr class="card-horizontal-ruler">
    <div class="flex justify-between items-center mt-3.5">
      <div>
        <div v-show="!showSkeleton" class="ion-item-no-padding-x flex flex-col items-center mt-0.5">
          <span class="primary-text-color text-2xs 2xs:text-xs">{{ `${$t('monday')}-${$t('friday')}` }}</span>
          <p class="primary-text-color text-2xs 2xs:text-xs">{{ place.working_hours?.mon_fri }}</p>
        </div>
        <ion-skeleton-text
            v-show="showSkeleton"
            animated
            class="h-8 w-28 rounded-md"
        ></ion-skeleton-text>
      </div>
      <div>
        <div v-show="!showSkeleton" class="ion-item-no-padding-x flex flex-col items-center mt-0.5">
          <span class="primary-text-color text-2xs 2xs:text-xs">{{ $t('saturday') }}</span>
          <p class="primary-text-color text-2xs 2xs:text-xs">{{ place.working_hours?.saturday }}</p>
        </div>
        <ion-skeleton-text
            v-show="showSkeleton"
            animated
            class="h-8 w-28 rounded-md ml-2"
        ></ion-skeleton-text>
      </div>
      <div>
        <div v-show="!showSkeleton" class="ion-item-no-padding-x flex flex-col items-center mt-0.5">
          <span class="primary-text-color text-2xs 2xs:text-xs">{{ $t('sunday') }}</span>
          <p class="primary-text-color text-2xs 2xs:text-xs">{{ place.working_hours?.sunday }}</p>
        </div>
        <ion-skeleton-text
            v-show="showSkeleton"
            animated
            class="h-8 w-28 rounded-md ml-2"
        ></ion-skeleton-text>
      </div>
    </div>
    <hr class="card-horizontal-ruler mt-3.5">
    <AppModal
        :is-open="isModalOpen"
        css-class="custom-map-modal"
        @didDismiss="openModal(false);"
    >
      <MapModal :place="place"/>
    </AppModal>
  </div>
</template>

<script>
import { computed, defineComponent, toRefs } from 'vue';
import { useI18n }                           from 'vue-i18n';
import {
  IonIcon,
  IonButton,
  IonSkeletonText,
}                                            from '@ionic/vue';

import AppModal from '@/components/AppModal';
import MapModal from '@/components/user/modals/MapModal';

import { useModal } from '@/composables/useModal';

import {
  pieChart,
  locationOutline,

}
  from 'ionicons/icons';

export default defineComponent({

  name: "PlaceInfoBody",
  components: {
    IonIcon,
    IonButton,
    IonSkeletonText,
    AppModal,
    MapModal,
  },
  props: {
    place: {
      type: Object,
      default: null,
    },
    showSkeleton: {
      type: Boolean,
      default: null,
    },
  },
  setup(props) {
    /* Component properties */
    const { place } = toRefs(props);
    const freeSeats = computed(() => {
      const ratio = place.value?.availability_ratio?.split('/');

      if(!ratio) {
        return t('loading');
      }

      return `${ratio[1] - ratio[0]}/${ratio[1]}`;
    });
    /* Composables */
    const { isModalOpen, openModal } = useModal();
    const { t } = useI18n();


    return {
      /* Component properties */
      isModalOpen,
      freeSeats,

      /* Event handlers */
      openModal,

      /* Icons from */
      pieChart,
      locationOutline,
    };
  },

});
</script>
<style scoped>
ion-item {
  --border-style: none;
}

ion-button {
  font-size: 0.7rem !important;
}
</style>