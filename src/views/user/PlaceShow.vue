<template>
  <ion-page>

    <TheGoBackHeader class="px-2 py-1"/>

    <ion-content ref="content" class="h-full">
      <ion-refresher pull-min="100" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>

      <div class="h-full mt-3">
        <div class="h-full flex flex-col justify-between">
          <div>
            <MainImagePreview
                :path="mainImagePath"
                :label="$t('gallery')"
                :show-skeleton="showSkeleton"
                @click="openPreview(place.images?.filter(img => !img.is_logo))"
            />
            <div class="mt-4 ion-item-no-padding-x">
              <h1 v-show="!showSkeleton" class="cafe-show-name">{{ place.name }}</h1>
              <h1 v-show="showSkeleton">
                <ion-skeleton-text animated class="rounded-md h-8 w-2/3"></ion-skeleton-text>
              </h1>
              <p v-show="!showSkeleton" class="cafe-show-offers mt-1">{{ $t('showPlace') }}</p>
              <p v-show="showSkeleton" class="mt-1">
                <ion-skeleton-text animated class="rounded-md h-12"></ion-skeleton-text>
              </p>
            </div>

            <PlaceInfoBody
                :place="place"
                :show-skeleton="showSkeleton"
            />

            <div>
              <FilterCategoryHeading class="mt-4" :title="$t('tables')" :icon="storefrontOutline"/>
              <TableContainer v-show="!showSkeleton" class="mt-2">
                <Table
                    v-for="table in place.tables"
                    :key="table.id"
                    :empty="Number(table.empty)"
                    :draggable="false"
                    :style="
                      `position: absolute;
                      top: 0; left: 0;
                      transform:translate(${table.position.left}px, ${table.position.top}px)
                      `
                    "
                />
              </TableContainer>
            </div>

            <div v-show="showSkeleton">
              <ion-skeleton-text animated class="rounded-md" style="height: 180px;"></ion-skeleton-text>
            </div>

            <ProductMenu :place-info="place"/>
          </div>

          <div>
            <ion-button
                class="uppercase button-subscribe-wide"
                expand="block"
                :disabled="!loggedIn || platformIsWeb"
                @click="openModal(true)"
            >
              <ion-icon slot="start"
                        :icon="isUserSubscribed ? notifications : notificationsOutline"></ion-icon>
              {{ isUserSubscribed ? $t('subscribed') : $t('subscribe') }}
            </ion-button>
          </div>
        </div>
      </div>
      <AppModal
          :is-open="isModalOpen"
          css-class="custom-sub-modal"
          @didDismiss="openModal(false);$emit('dismissPlaceInfoModal')"
      >
        <PlaceSubscriptionModal
            :place="{'id': place.id, 'name': place.name}"
            @dismiss-subscription-modal="openModal(false);"
            @user-toggled-subscription="isUserSubscribed = !isUserSubscribed"
        />
      </AppModal>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore }                              from 'vuex';
import { useRoute }                              from 'vue-router';
import { useI18n }                               from 'vue-i18n';
import { Capacitor }                             from '@capacitor/core';
import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton,
  IonSkeletonText,
  IonRefresher,
  IonRefresherContent,
  modalController,
  onIonViewWillEnter,
  onIonViewWillLeave,
}                                                from '@ionic/vue';

import TheGoBackHeader        from '@/components/user/headers/TheGoBackHeader';
import MainImagePreview       from '@/components/MainImagePreview';
import PlaceInfoBody          from '@/components/place/PlaceInfoBody';
import FilterCategoryHeading  from '@/components/user/FilterCategoryHeading';
import TableContainer         from '@/components/TableContainer';
import Table                  from '@/components/Table';
import ProductMenu            from '@/components/user/ProductMenu';
import AppModal               from '@/components/AppModal';
import PlaceSubscriptionModal from '@/components/user/modals/PlaceSubscriptionModal';
import ImagePreviewModal      from '@/components/user/modals/ImagePreviewModal';

import PlaceService from '@/services/PlaceService';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useModal }              from '@/composables/useModal';
import { useContent }            from '@/composables/useContent';

import {
  notifications,
  notificationsOutline,
  storefrontOutline,
  pizzaOutline,
}
  from 'ionicons/icons';

import { calculatePxFromPercent } from '@/utils/helpers';
import { useCache }               from '@/composables/useCache';

export default defineComponent({
  name: "PlaceShow",
  components: {
    IonPage,
    IonContent,
    IonIcon,
    IonButton,
    IonSkeletonText,
    IonRefresher,
    IonRefresherContent,
    TheGoBackHeader,
    MainImagePreview,
    PlaceInfoBody,
    FilterCategoryHeading,
    TableContainer,
    Table,
    ProductMenu,
    AppModal,
    PlaceSubscriptionModal,
  },
  setup() {
    /* Global properties */
    const route = useRoute();
    const store = useStore();
    const { t } = useI18n();

    /* Component properties */
    const content = ref();
    const place = ref({});
    const isUserSubscribed = ref(false);
    let searchTab = null;
    const platformIsWeb = Capacitor.getPlatform() === 'web';
    const showSkeleton = ref(true);
    const dropzoneWidth = computed(() => {
      return store.getters['global/width'] - ((2.25 * parseFloat(getComputedStyle(document.documentElement).fontSize)) + 4);
    });

    /* Computed properties */
    const loggedIn = computed(() => store.getters['auth/loggedIn']);
    const mainImagePath = computed(() => {
      if(place.value.images?.length > 0) {
        return place.value.images?.find((image) => image.is_main)?.path
            ?? place.value.images[0].path;
      }else {
        return '/places/default_place_cover.png';
      }
    });

    /* Composables */
    const { showErrorToast } = useToastNotifications();
    const { isModalOpen, openModal } = useModal();
    const { scrollToTop } = useContent();
    const { getCachedOrFetchPlaceAdditionalInfo } = useCache();

    /* Methods */
    const getPlace = async() => {
      showSkeleton.value = true;
      try {
        const response = await PlaceService.show(route.params.id, true, true);
        await getCachedOrFetchPlaceAdditionalInfo(Number(route.params.id));

        place.value = response.data;
        place.value.images = store.getters['user/getPlaceAdditionInfo'](Number(route.params.id)).images;
        place.value.working_hours = store.getters['user/getPlaceAdditionInfo'](Number(route.params.id)).working_hours;

        place.value.tables?.forEach(table => {
          table.position.left = calculatePxFromPercent(table.position.left, dropzoneWidth.value);
        });

        if(loggedIn.value) {
          const subscriptionResponse = await PlaceService.isUserSubscribed(route.params.id);
          isUserSubscribed.value = !!subscriptionResponse.data.subscribed;
        }
        showSkeleton.value = false;
      }catch(error) {
        showErrorToast(
            null,
            {
              generalError: t('dataFetchingError'),
            });
      }
    };

    /* Lifecycle hooks */
    (async() => {
      await getPlace();
    })();
    onIonViewWillEnter(() => {
      searchTab = document.getElementById('tab-button-search');
      if(searchTab) {
        searchTab.style.color = getComputedStyle(document.documentElement)
            .getPropertyValue('--user-selected-color');
      }
    });
    onIonViewWillLeave(() => {
      if(searchTab) {
        searchTab.style.color = '';
      }

      scrollToTop(content.value, 1);
    });


    /* Event handlers */
    const openPreview = async(images) => {
      const modal = await modalController
          .create({
            component: ImagePreviewModal,
            cssClass: 'custom-gallery-modal',
            componentProps: {
              images,
            },
          });
      return modal.present();
    };
    const refresh = async(event) => {
      await getPlace();

      event.target.complete();
    };

    /* Watchers */
    // Watching for changes of id parameter in place show route and fetching right data
    watch(route, async() => {
      if(route.name === 'place.show' && route.params.id) {
        await getPlace();
      }
    });

    return {
      /* Global properties */
      /* Component properties */
      content,
      place,
      mainImagePath,
      isModalOpen,
      isUserSubscribed,
      platformIsWeb,
      showSkeleton,

      /* Computed properties */
      loggedIn,

      /* Event handlers */
      openModal,
      openPreview,
      refresh,

      /* Icons */
      notifications,
      notificationsOutline,
      storefrontOutline,
      pizzaOutline,
    };
  },

});
</script>
<style scoped>
#goHeader {
  background: var(--show-paint);
  border-bottom: solid 1px var(--horizontal-divider);
}

ion-toolbar {
  --border-style: none;
  --background: var(--show-paint);
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

ion-content {
  --background: var(--show-paint);
  background: var(--show-paint);
  --padding-start: 1rem;
  --padding-end: 1rem;
  --padding-bottom: 1rem;
}
</style>