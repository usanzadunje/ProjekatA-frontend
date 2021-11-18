<template>
  <div
      v-if="this.$store.getters['owner/dayOffRequests'](selectedMonth, selectedYear).length > 0"
  >
    <div
        v-show="!showSkeleton && !loading"
        class="flex flex-col gap-2"
    >
      <div
          v-for="request in this.$store.getters['owner/dayOffRequests'](selectedMonth, selectedYear)"
          :key="request.id"
          class="w-full py-4 px-1 bg-gray-200 rounded-md"
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
          <div class="w-1/4 px-1">
            <span>{{ getDisplayNameForUser(request.staff) }}</span>
          </div>
          <div
              class="w-1/2 flex flex-col justify-center items-center px-1 border-l border-r border-gray-300"
          >
            <span>
              {{ `${$t('start')}: ${parseDateToString(request.start_date)}` }}<br>
            </span>
            <span>
              {{ `${$t('end')}: ${parseDateToString(request.end_date)}` }}<br>
            </span>
          </div>
          <div class="w-1/4 flex justify-center items-center px-1">
            <div class="flex items-center mr-1">
              <ion-button
                  fill="clear"
                  :disabled="request.status === APPROVED"
                  class="reset-button-size"
                  @click="approveRequest(request.id, getDisplayNameForUser(request.staff), $event)"
              >
                <ion-icon
                    slot="icon-only"
                    :icon="checkmarkCircleOutline"
                    class="text-success flex-shrink-0 text-4xl"
                ></ion-icon>
              </ion-button>
            </div>
            <div class="flex items-center">
              <ion-button
                  fill="clear"
                  :disabled="request.status === DECLINED"
                  class="reset-button-size"
                  @click="declineRequest(request.id, getDisplayNameForUser(request.staff), $event)"
              >
                <ion-icon
                    slot="icon-only"
                    :icon="removeCircleOutline"
                    class="text-danger flex-shrink-0 text-4xl"
                ></ion-icon>
              </ion-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
        v-show="showSkeleton || loading"
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
  <div
      v-else
      class="flex flex-col justify-center items-center h-3/5"
  >
    <NoDaysOffRequestedPlaceholderImage
        :width="'70%'"
        class="mt-6"
    />
    <div class="w-full mt-6 px-2">
      <h2 class="placeholder-heading-big primary-text-color break-words text-center">
        {{ $t('noDayOffRequests1') }}
      </h2>
      <h3 class="placeholder-heading-small primary-text-color break-words text-center">
        {{ $t('noDayOffRequests2') }}
      </h3>
    </div>
  </div>
</template>

<script>
import { defineComponent, toRefs, watch } from 'vue';
import { useStore }                       from 'vuex';
import {
  IonButton,
  IonIcon,
  IonSkeletonText,
}                                         from '@ionic/vue';

import AppModal                           from '@/components/AppModal';
import DayOffRequestReviewModal           from '@/components/owner/modals/DayOffRequestReviewModal';
import RequestStatusText                  from '@/components/staff/RequestStatusText';
import NoDaysOffRequestedPlaceholderImage from '@/components/images/NoDaysOffRequestedPlaceholderImage';

import { useModal }          from '@/composables/useModal';
import { useDaysOffRequest } from '@/composables/useDaysOffRequest';

import { getDisplayNameForUser, parseDateToString } from '@/utils/helpers';

import {
  checkmarkCircleOutline,
  removeCircleOutline,
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
    NoDaysOffRequestedPlaceholderImage,
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
    requestIdToOpen: {
      type: Number,
      default: null,
    },
  },
  setup(props) {
    /* Global properties */
    const store = useStore();
    /* Component properties */
    const { requestIdToOpen } = toRefs(props);

    /* Composables */
    const { isModalOpen, modalData, openModal } = useModal();
    const {
      loading,
      PENDING,
      DECLINED,
      APPROVED,
      approveRequest,
      declineRequest,
    } = useDaysOffRequest();

    /* Methods */

    /* Event handlers */
    /* Watchers */
    watch(requestIdToOpen, () => {
      if(requestIdToOpen.value && !isModalOpen.value) {
        openModal(true, store.getters['owner/dayOffRequestById'](requestIdToOpen.value));
      }
    });

    return {
      /* Component properties */
      loading,
      isModalOpen,
      modalData,
      openModal,
      PENDING,
      DECLINED,
      APPROVED,
      getDisplayNameForUser,
      parseDateToString,

      /* Event handlers */
      approveRequest,
      declineRequest,

      /* Icons */
      checkmarkCircleOutline,
      removeCircleOutline,
    };
  },
});

</script>
<style scoped>

</style>
