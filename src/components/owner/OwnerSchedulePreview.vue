<template>
  <div>
    <div
        v-if="schedules.length > 0"
    >
      <div class="flex justify-end">
        <ion-button
            class="user-selected-button-background mt-2"
            @click="openScheduleModal"
        >
          {{ $t('addStaff') }}
        </ion-button>
      </div>

      <div
          v-if="!showSkeleton"
          class="mt-1"
      >
        <ion-item-sliding
            v-for="schedule in schedules"
            :key="schedule.id"
            class="bg-gray-200 rounded-md mb-2"
            @click="openScheduleModal($event, schedule)"
        >
          <ion-item
              lines="none"
              class="ion-no-padding ion-no-margin bg-gray-200"
          >
            <div class="text-center w-full">
              <div class="text-base font-medium">
                <span class="uppercase user-selected-color">{{ $t('start') }}: </span>
                <span class="">{{ schedule.start_time }}</span>
              </div>
              <div class="flex mt-2">
                <div class="w-1/2 flex flex-col items-center justify-between border-r border-gray-300">
                  <span class="text-sm user-selected-color">
                    {{ $t('employee') }}
                  </span>
                  <div class="flex items-center justify-center">
                    <p class="text-lg break-all">
                      {{ getDisplayNameForUser(schedule.staff) }}
                    </p>
                  </div>
                </div>
                <div class="w-1/2 flex flex-col items-center justify-between">
                  <span class="text-sm user-selected-color">
                    {{ $t('hoursOfWork') }}
                  </span>
                  <div class="flex items-center justify-center">
                    <ion-icon
                        slot="icon-only"
                        :icon="timeOutline"
                        class="text-lg mr-1"
                    ></ion-icon>
                    <p class="text-lg">
                      {{ schedule.number_of_hours }}h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ion-item>

          <ion-item-options side="end" @ionSwipe="removeSwiping(schedule.id, $event)">
            <ion-item-option type="button" :expandable="true" @click="showAlert(schedule.id, $event)">
              <ion-icon
                  slot="icon-only"
                  :icon="trashOutline"
                  class="text-2xl"
              ></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </div>
      <div
          v-else
      >
        <div
            v-for="i in 5"
            :key="i"
            class="w-full h-24 rounded-md"
        >
          <ion-skeleton-text
              animated
          >
          </ion-skeleton-text>
        </div>
      </div>
    </div>
    <div
        v-else
        class="flex flex-col justify-center items-center h-60vh"
    >
      <NoSchedulePlaceholderImage
          :width="'70%'"
      />
      <div class="w-full mt-6 px-2 flex flex-col items-center justify-center">
        <h2 class="placeholder-heading-big primary-text-color break-words text-center">
          {{ $t('noStaffSchedule1') }}
        </h2>
        <h3 class="placeholder-heading-small primary-text-color break-words text-center">
          {{ $t('noStaffSchedule2') }}
        </h3>
        <div>
          <ion-button
              class="user-selected-button-background mt-2"
              @click="openScheduleModal"
          >
            {{ $t('add') }}
          </ion-button>
        </div>
      </div>
    </div>
    <AppModal
        :is-open="isModalOpen"
        css-class="custom-day-off-request-modal"
        :swipeToClose="false"
        width="90%"
        @didDismiss="openModal(false);"
    >
      <AddEditStaffScheduleModal
          :schedule="modalData"
          @dismiss="openModal(false)"
      />
    </AppModal>
  </div>
</template>

<script>
import { computed, defineComponent, toRefs } from 'vue';
import { useI18n }                           from 'vue-i18n';
import {
  IonButton,
  IonSkeletonText,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon, alertController,
}                                            from '@ionic/vue';

import AppModal                   from '@/components/AppModal';
import AddEditStaffScheduleModal  from '@/components/owner/modals/AddEditStaffScheduleModal';
import NoSchedulePlaceholderImage from '@/components/images/NoSchedulePlaceholderImage';

import { useModal }      from '@/composables/useModal';
import { useCache }      from '@/composables/useCache';
import { useSchedule }   from '@/composables/useSchedule';
import { shrink, swipe } from '@/composables/useAnimations';

import { getDisplayNameForUser } from '@/utils/helpers';

import { Haptics, ImpactStyle } from '@capacitor/haptics';

import {
  timeOutline,
  trashOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'OwnerSchedulePreview',
  components: {
    IonButton,
    IonSkeletonText,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    AppModal,
    AddEditStaffScheduleModal,
    NoSchedulePlaceholderImage,
  },
  props: {
    weekStartDay: {
      type: Number,
      default: null,
      required: true,
    },
    weekStartMonth: {
      type: Number,
      default: null,
      required: true,
    },
    selectedYear: {
      type: Number,
      default: null,
      required: true,
    },
    showSkeleton: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    /* Global properties */

    /* Component properties */
    const { weekStartDay, weekStartMonth, selectedYear } = toRefs(props);
    const schedules = computed(() => staffSchedules(weekStartDay.value, weekStartMonth.value, selectedYear.value));

    /* Composables */
    const { isModalOpen, modalData, openModal } = useModal();
    const { getCachedOrFetchStaff } = useCache();
    const {
      staffSchedules,
      fetchScheduleForOwner,
      removeEmployeeFromSchedule,
    } = useSchedule();
    const { fullSwipeLeft } = swipe();
    const { shrinkToMiddle } = shrink();
    const { t } = useI18n();

    /* Lifecycle hook */
    (async() => {
      await getCachedOrFetchStaff();
      await fetchScheduleForOwner();
    })();

    /* Event handlers */
    const openScheduleModal = (event, schedule = {}) => {
      openModal(true, {
        ...schedule,
        start_date: `${weekStartDay.value}-${weekStartMonth.value + 1}-${selectedYear.value}`,
      });
    };
    const showAlert = async(id, event) => {
      event?.stopPropagation();

      const alert = await alertController
          .create({
            header: t('alertRemoveScheduleHeader'),
            message: t('alertRemoveScheduleMessage'),
            buttons: [
              {
                text: t('disagree'),
                role: 'cancel',
              },
              {
                text: t('agree'),
                handler: async() => {
                  fullSwipeLeft(event.target.parentElement.parentElement.parentElement.firstChild);
                  shrinkToMiddle(event.target.parentElement.parentElement.parentElement);

                  await removeEmployeeFromSchedule(id);
                },
              },
            ],
          });
      await alert.present();
    };
    const removeSwiping = (id, event) => {
      fullSwipeLeft(event.target.parentElement.firstChild);
      shrinkToMiddle(event.target.parentElement);

      Haptics.impact({ style: ImpactStyle.Heavy });

      removeEmployeeFromSchedule(id);
    };

    return {
      /* Component properties */
      isModalOpen,
      modalData,
      schedules,
      getDisplayNameForUser,

      /* Event handlers */
      openScheduleModal,
      openModal,
      showAlert,
      removeSwiping,

      /* Icons */
      timeOutline,
      trashOutline,
    };
  },
});

</script>
<style scoped>
ion-item {
  --background: #E5E7EB !important;
  --padding-top: 0.5rem;
  --padding-end: 0.5rem;
  --padding-start: 0.5rem;
  --padding-bottom: 0.5rem;
}

ion-item-options {
  --border-style: none;
  background-color: #e01b43 !important;
}

ion-item-option {
  --border-style: none;
  --background: #e01b43;
  background: #e01b43;
}

ion-item-option:active {
  background: #d95c75;
}
</style>
