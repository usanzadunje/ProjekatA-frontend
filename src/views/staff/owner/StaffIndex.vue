<template>
  <ion-page>
    <ion-content>
      <ion-refresher
          pull-min="100"
          slot="fixed"
          @ionRefresh="refresh($event)"
          class="transparent"
      >
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>

      <div
          v-if="hasStaff"
          class="wrap"
      >
        <TheHangingHeader class="mb-4">
          <div class="pt-2 pb-4 px-4 xs:px-12">
            <h1 class="secondary-heading text-center">{{ $t('owner.staff') }}</h1>

            <div class="mx-auto mt-4">
              <ion-button
                  expand="block"
                  class="auth-button-size auth-button-border-radius uppercase button-text-white"
                  @click="createStaffMember"
              >
                {{ $t('create') }}
              </ion-button>
            </div>
          </div>
        </TheHangingHeader>

        <div
            v-show="!showSkeleton"
            class="xs:px-8"
        >
          <StaffCard
              v-for="staffMember in staff"
              :key="staffMember.id"
              :staff="staffMember"
              :button="true"
              @edit-staff="editStaffMember(staffMember)"
          >
            <div class="absolute top-1.5 right-3 z-40">
              <ion-icon
                  :icon="close"
                  slot="icon-only"
                  class="text-2xl text-danger ml-2"
                  @click="deleteStaffMember(staffMember, $event)"></ion-icon>
            </div>
          </StaffCard>
        </div>

        <div v-show="showSkeleton">
          <div v-for="i in 9" :key="i">
            <StaffCardSkeleton/>
          </div>
        </div>
      </div>
      <div
          v-if="showPlaceholder"
          class="w-full h-full flex flex-col items-start justify-center px-6"
      >
        <AddStaffPlaceholderImage/>

        <div class="flex flex-col items-center mt-2">
          <p class="text-center placeholder-heading-big primary-text-color">
            {{ $t('noStaffHeading1') }}
          </p>
          <p class="text-center placeholder-heading-small primary-text-color break-words">
            {{ $t('noStaffHeading2') }}
          </p>

          <ion-button
              class="user-selected-button-background mt-2"
              @click="createStaffMember"
          >
            {{ $t('add') }}
          </ion-button>
        </div>
      </div>


      <AppModal
          :is-open="isModalOpen"
          css-class="custom-staff-modal"
          :swipeToClose="false"
          width="90%"
          @didDismiss="openModal(false);"
      >
        <StaffCreateEditModal
            :staff="modalData"
            @dismiss="openModal(false)"
        />
      </AppModal>

      <ion-infinite-scroll
          threshold="100px"
          :disabled="isInfiniteScrollDisabled || showSkeleton"
          @ionInfinite="loadMoreStaff($event)"
      >
        <ion-infinite-scroll-content
            loading-spinner="dots"
        >
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, computed, ref, watch } from 'vue';
import { useStore }                              from 'vuex';
import { useI18n }                               from 'vue-i18n';
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  alertController,
}                                                from '@ionic/vue';

import StaffCard                from '@/components/staff/cards/StaffCard';
import StaffCardSkeleton        from '@/components/staff/cards/StaffCardSkeleton';
import AppModal                 from '@/components/AppModal';
import StaffCreateEditModal     from '@/components/staff/modals/StaffCreateEditModal';
import TheHangingHeader         from '@/components/TheHangingHeader';
import AddStaffPlaceholderImage from '@/components/images/AddStaffPlaceholderImage';

import { useModal }         from '@/composables/useModal';
import { useErrorHandling } from '@/composables/useErrorHandling';

import {
  close,
}                                from 'ionicons/icons';
import { shrink }                from '@/composables/useAnimations';
import { getDisplayNameForUser } from '@/utils/helpers';

export default defineComponent({
  name: "StaffIndex",
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonButton,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    TheHangingHeader,
    StaffCard,
    StaffCardSkeleton,
    AppModal,
    StaffCreateEditModal,
    AddStaffPlaceholderImage,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const staff = computed(() => store.getters['owner/staff']);
    const hasStaff = computed(() => store.getters['owner/staff'].length > 0);
    const isInfiniteScrollDisabled = ref(false);
    const showSkeleton = ref(true);
    const showPlaceholder = ref(false);
    let offset = 0;

    /* Composables */
    const { t } = useI18n();
    const { isModalOpen, modalData, openModal } = useModal();
    const { tryCatch } = useErrorHandling();
    const { shrinkToMiddle } = shrink();

    /* Methods */
    const getStaff = async(load = null) => {
      showSkeleton.value = !load;

      await tryCatch(
          async() => {
            isInfiniteScrollDisabled.value = await store.dispatch('owner/getStaffInfo', {
              offset,
              limit: 10,
              load,
            });
          },
          {
            errorMessageKey: 'dataFetchingError',
          },
      );

      showSkeleton.value = false;
      showPlaceholder.value = !hasStaff.value;
    };
    /* Lifecycle hooks */
    (async() => {
      await getStaff();
    })();

    /* Event handlers */
    const createStaffMember = async() => {
      modalData.value = null;

      openModal(true);
    };
    const editStaffMember = async(staffMember, event = null) => {
      event?.stopPropagation();

      openModal(true, staffMember);
    };
    const deleteStaffMember = async(staffMember, event = null) => {
      event?.stopPropagation();

      const alert = await alertController
          .create({
            header: t('staff.alertRemoveStaffHeader', {
              staff: getDisplayNameForUser(staffMember),
            }),
            message: t('staff.removeStaffMessage'),
            buttons: [
              {
                text: t('disagree'),
                role: 'cancel',
              },
              {
                text: t('agree'),
                handler: async() => {
                  await tryCatch(
                      async() => {
                        shrinkToMiddle(event.target.parentElement.parentElement);

                        await store.dispatch('owner/deleteStaff', staffMember.id);
                      },
                      {
                        errorMessageKey: 'generalAlertError',
                        catchCallback: () => {
                          event.target.parentElement.parentElement.style.transform = 'scaleY(1)';
                        },
                      },
                  );
                },
              },
            ],
          });
      await alert.present();
    };
    const refresh = async(event) => {
      offset = 0;

      await getStaff();

      event.target.complete();
    };
    const loadMoreStaff = async(e) => {
      offset += 10;

      await getStaff(true);

      e?.target.complete();
    };

    /* Watchers */
    watch(hasStaff, () => {
      showPlaceholder.value = !hasStaff.value;
    });

    return {
      /* Component properties */
      staff,
      hasStaff,
      isModalOpen,
      modalData,
      isInfiniteScrollDisabled,
      showSkeleton,
      showPlaceholder,

      /* Event handlers */
      createStaffMember,
      editStaffMember,
      deleteStaffMember,
      refresh,
      openModal,
      loadMoreStaff,

      /* Icons */
      close,
    };
  },

});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
  background: var(--show-paint);
}
</style>