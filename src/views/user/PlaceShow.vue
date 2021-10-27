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
                    @click="showTableTooltip($event, table)"
                />
              </TableContainer>
            </div>

            <div v-show="showSkeleton">
              <ion-skeleton-text animated class="rounded-md" style="height: 180px;"></ion-skeleton-text>
            </div>

            <ProductMenu
                :place="place"
                :loading-products="loadingProducts"
                :reset-product-offset="resetProductOffset"
                @load-more-products="loadMoreProducts($event)"
            />
          </div>

          <div>
            <ion-button
                expand="block"
                :disabled="!loggedIn || platformIsWeb"
                class="uppercase button-subscribe-wide mb-6"
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
            @dismiss="openModal(false);"
        />
      </AppModal>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore }                              from 'vuex';
import { useRoute }                              from 'vue-router';
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
import TableTooltipPopover    from '@/components/user/popovers/TableTooltipPopover';
import ProductMenu            from '@/components/user/ProductMenu';
import AppModal               from '@/components/AppModal';
import PlaceSubscriptionModal from '@/components/user/modals/PlaceSubscriptionModal';
import ImagePreviewModal      from '@/components/user/modals/ImagePreviewModal';

import PlaceService   from '@/services/PlaceService';
import ProductService from '@/services/ProductService';

import { useModal }         from '@/composables/useModal';
import { useContent }       from '@/composables/useContent';
import { useCache }         from '@/composables/useCache';
import { usePopover }       from '@/composables/usePopover';
import { useErrorHandling } from '@/composables/useErrorHandling';
import { deviceWidth }      from '@/composables/useDevice';

import {
  notifications,
  notificationsOutline,
  storefrontOutline,
  pizzaOutline,
}
  from 'ionicons/icons';

import { calculatePxFromPercent } from '@/utils/helpers';

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

    /* Component properties */
    const content = ref();
    const place = ref({});
    const isUserSubscribed = computed(() => store.getters['user/isSubscribedTo'](place.value.id));
    let searchTab = null;
    const platformIsWeb = Capacitor.getPlatform() === 'web';
    const showSkeleton = ref(true);
    const loadingProducts = ref(false);
    const resetProductOffset = ref(false);
    const dropzoneWidth = computed(() => {
      return deviceWidth.value - ((2.25 * parseFloat(getComputedStyle(document.documentElement).fontSize)) + 4);
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
    const { isModalOpen, openModal } = useModal();
    const { scrollToTop } = useContent();
    const { getCachedOrFetchPlaceAdditionalInfo } = useCache();
    const { openPopover } = usePopover();
    const { tryCatch } = useErrorHandling();

    /* Methods */
    const getPlace = async() => {
      const placeId = Number(route.params.id);

      resetProductOffset.value = true;
      showSkeleton.value = true;

      await tryCatch(
          async() => {
            const response = await PlaceService.show(placeId, true, true);
            await getCachedOrFetchPlaceAdditionalInfo(placeId);

            place.value = response.data;
            place.value.images = store.getters['user/getPlaceAdditionInfo'](placeId).images;
            place.value.working_hours = store.getters['user/getPlaceAdditionInfo'](placeId).working_hours;

            place.value.tables?.forEach(table => {
              table.position.left = calculatePxFromPercent(table.position.left, dropzoneWidth.value);
            });

            showSkeleton.value = false;
          },
          null,
          'dataFetchingError',
      );

      resetProductOffset.value = false;
    };
    const loadMoreProducts = async({ categoryId, offset, event }) => {
      loadingProducts.value = true;

      await tryCatch(
          async() => {
            const response = await ProductService.indexByCategory(Number(route.params.id), categoryId, offset, 10);

            if(!response.data) {
              event.target.classList.add('hidden');
              return;
            }
            if(response.data.length < 10) {
              event.target.classList.add('hidden');
            }

            let category = place.value.categories.find(category => category.id === categoryId);

            category.products = category.products.concat(response.data);
          },
          null,
          'dataFetchingError',
      );

      loadingProducts.value = false;
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
    const showTableTooltip = async(event, table) => {
      await openPopover(
          TableTooltipPopover,
          event,
          'table-tooltip-popover',
          {
            table,
          },
      );
    };

    /* Watchers */
    // Watching for changes of id parameter in place show route and fetching right data
    watch(() => route.params.id, async() => {
      if(route.name === 'place.show' && route.params.id && route.params.id != place.value.id) {
        await getPlace();
      }
      if(route.params.id == place.value.id) {
        showSkeleton.value = false;
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
      loadingProducts,
      resetProductOffset,

      /* Computed properties */
      loggedIn,

      /* Event handlers */
      openModal,
      openPreview,
      refresh,
      loadMoreProducts,
      showTableTooltip,

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