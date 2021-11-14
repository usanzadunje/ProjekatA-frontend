<template>
  <div>
    <div
        v-show="!showSkeleton"
        class="flex flex-col gap-2"
    >
      <div
          v-for="request in staffRequestsForSelectedDate(selectedMonth, selectedYear)"
          :key="request.id"
          class="w-full py-4 px-2 bg-gray-200 rounded-md"
          @click="openModal(true, request)"
      >
        <div
            class="w-full text-center -mt-3 mb-1 uppercase font-bold"
        >
          <RequestStatusText
              :status="request.status"
          />
        </div>
        <div class="flex justify-between items-center text-center">
          <span>{{ getDisplayNameForUser(request.staff) }}</span>
          <div
              class="flex flex-col justify-center items-center px-2 border-l border-r border-gray-300"
          >
            <span>{{ `${$t('start')}: ${(request.start_date)}` }}</span>
            <span>{{ `${$t('end')}: ${request.end_date}` }}</span>
          </div>
          <div>
            <div class="flex justify-center items-center w-20 ml-1 text-3xl">
              <ion-button
                  fill="clear"
                  :disabled="request.status === APPROVED"
                  class="reset-button-size"
                  @click="approveRequest(request.id, getDisplayNameForUser(request.staff))"
              >
                <ion-icon
                    slot="icon-only"
                    :icon="checkmarkCircleOutline"
                    class="text-success flex-shrink-0"
                ></ion-icon>
              </ion-button>
              <ion-button
                  fill="clear"
                  :disabled="request.status === DECLINED"
                  class="reset-button-size"
                  @click="declineRequest(request.id, getDisplayNameForUser(request.staff))"
              >
                <ion-icon
                    slot="icon-only"
                    :icon="closeCircleOutline"
                    class="text-danger ml-2 flex-shrink-0"
                ></ion-icon>
              </ion-button>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div
        v-show="showSkeleton"
        class="flex flex-col gap-2"
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

    <AppModal
        :is-open="isModalOpen"
        css-class="custom-day-off-request-modal"
        :swipeToClose="false"
        width="90%"
        @didDismiss="openModal(false);"
    >
      <DayOffRequestReviewModal
          :request-data="modalData"
          @dismiss="openModal(false)"
      />
    </AppModal>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonButton,
  IonIcon,
  IonSkeletonText,
}                          from '@ionic/vue';

import AppModal                 from '@/components/AppModal';
import DayOffRequestReviewModal from '@/components/owner/modals/DayOffRequestReviewModal';
import RequestStatusText        from '@/components/staff/RequestStatusText';

import { useModal }          from '@/composables/useModal';
import { useDaysOffRequest } from '@/composables/useDaysOffRequest';

import { getDisplayNameForUser } from '@/utils/helpers';

import {
  checkmarkCircleOutline,
  closeCircleOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'DayOffCalendarPicker',
  components: {
    IonSkeletonText,
    IonButton,
    IonIcon,
    RequestStatusText,
    AppModal,
    DayOffRequestReviewModal,
  },
  props: {
    showSkeleton: {
      type: Boolean,
      default: false,
    },
    selectedMonth: {
      type: Number,
      default: null,
      required: true,
    },
    selectedYear: {
      type: Number,
      default: null,
      required: true,
    },
  },
  setup() {
    /* Global properties */

    /* Component properties */
    // const { selectedMonth, selectedYear } = toRefs(props);

    /* Composables */
    const { isModalOpen, modalData, openModal } = useModal();
    const {
      PENDING,
      DECLINED,
      APPROVED,
      staffRequestsForSelectedDate,
      approveRequest,
      declineRequest,
    } = useDaysOffRequest();

    /* Methods */

    /* Event handlers */


    return {
      /* Component properties */
      staffRequestsForSelectedDate,
      isModalOpen,
      modalData,
      openModal,
      getDisplayNameForUser,
      PENDING,
      DECLINED,
      APPROVED,

      /* Event handlers */
      approveRequest,
      declineRequest,

      /* Icons */
      checkmarkCircleOutline,
      closeCircleOutline,
    };
  },
});

</script>
<style scoped>

</style>
