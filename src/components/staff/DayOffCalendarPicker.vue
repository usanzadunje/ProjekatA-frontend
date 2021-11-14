<template>
  <div>
    <div
        v-show="!showSkeleton"
        class="grid grid-cols-auto gap-1 px-2"
    >
      <div
          v-for="dayNumber in getDaysInAMonth(selectedMonth)"
          :key="dayNumber"
          :style="{
            'color' : getTextColorFromRequestStatus(dayNumber, selectedMonth, selectedYear)
          }"
          class="h-16 p-1 relative primary-text-color"
          :class="{
              'user-selected-paint': dateIsCurrentDate(dayNumber, selectedMonth, selectedYear),
              'day-off-button border border-user-selected-color': !dateAlreadyPassed(dayNumber, selectedMonth, selectedYear),
              'opacity-30': dateAlreadyPassed(dayNumber, selectedMonth, selectedYear),
            }"
          @click="showDayOffRequestModal(dayNumber)"
      >
        <div
            class="absolute"
        >
          {{ dayNumber }}
        </div>
        <div
            v-if="getIconFromRequestStatus(dayNumber, selectedMonth, selectedYear)"
            class="h-full flex items-end justify-start text-xl"
        >
          <ion-icon
              slot="icon-only"
              :icon="getIconFromRequestStatus(dayNumber, selectedMonth, selectedYear)"
          ></ion-icon>
        </div>
      </div>
    </div>
    <div
        v-show="showSkeleton"
        class="grid grid-cols-auto gap-1 px-2"
    >
      <div
          v-for="dayNumber in getDaysInAMonth(selectedMonth)"
          :key="dayNumber"
          class="h-16"
      >
        <ion-skeleton-text animated>
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
      <DayOffRequestModal
          :request-data="modalData"
          @dismiss="openModal(false)"
      />
    </AppModal>
  </div>
</template>

<script>
import { defineComponent, toRefs } from 'vue';
import { useI18n }                 from 'vue-i18n';
import {
  IonIcon,
  IonSkeletonText,
}                                  from '@ionic/vue';

import AppModal           from '@/components/AppModal';
import DayOffRequestModal from '@/components/staff/modals/DayOffRequestModal';

import { useModal }              from '@/composables/useModal';
import { useToastNotifications } from '@/composables/useToastNotifications';
import { useDaysOffRequest }     from '@/composables/useDaysOffRequest';

import { getDaysInAMonth, dateAlreadyPassed, dateIsCurrentDate } from '@/utils/helpers';

import {
  helpCircleOutline,
  closeCircleOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'DayOffCalendarPicker',
  components: {
    IonSkeletonText,
    IonIcon,
    AppModal,
    DayOffRequestModal,
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
  setup(props) {
    /* Global properties */

    /* Component properties */
    const { selectedMonth, selectedYear } = toRefs(props);

    /* Composables */
    const { isModalOpen, modalData, openModal } = useModal();
    const { showWarningToast, showErrorToast } = useToastNotifications();
    const { t } = useI18n();
    const {
      PENDING,
      DECLINED,
      APPROVED,
      dayOffRequestedDay,
      dayOffRequestedDays,
      dayOffRequestedDayStatus,
      alreadyHavePendingRequestAtDate,
      alreadyHaveApprovedRequestAtDate,
      declinedRequestAtDate,
    } = useDaysOffRequest();

    /* Methods */
    const getTextColorFromRequestStatus = (day, month, year) => {
      const requestStatus = dayOffRequestedDayStatus(day, month, year);

      switch(requestStatus) {
        case PENDING:
          return 'var(--warning-color)';
        case DECLINED:
          return 'var(--danger-color)';
        case APPROVED:
          return 'var(--success-color)';
        default:
          return '';
      }
    };
    const getIconFromRequestStatus = (day, month, year) => {
      const requestStatus = dayOffRequestedDayStatus(day, month, year);

      switch(requestStatus) {
        case PENDING:
          return helpCircleOutline;
        case DECLINED:
          return closeCircleOutline;
        case APPROVED:
          return checkmarkCircleOutline;
        default:
          return null;
      }
    };

    /* Event handlers */
    const showDayOffRequestModal = (dayNumber) => {
      if(
          alreadyHavePendingRequestAtDate(dayNumber, selectedMonth.value, selectedYear.value) ||
          alreadyHaveApprovedRequestAtDate(dayNumber, selectedMonth.value, selectedYear.value) ||
          declinedRequestAtDate(dayNumber, selectedMonth.value, selectedYear.value) ||
          dateAlreadyPassed(dayNumber, selectedMonth.value, selectedYear.value)
      ) {
        if(alreadyHavePendingRequestAtDate(dayNumber, selectedMonth.value, selectedYear.value)) {
          showWarningToast(t('alreadyRequestedDay'));
        }else if(alreadyHaveApprovedRequestAtDate(dayNumber, selectedMonth.value, selectedYear.value)) {
          showWarningToast(t('alreadyApprovedDay'));
        }else if(declinedRequestAtDate(dayNumber, selectedMonth.value, selectedYear.value)) {
          openModal(
              true,
              {
                dayOffStartDate: `${dayNumber}-${selectedMonth.value + 1}-${selectedYear.value}`,
                declined: true,
              },
          );

          return;
        }else {
          showErrorToast(null, { invalidDate: t('requestedDayPassed') });
        }

        return;
      }

      openModal(
          true,
          {
            dayOffStartDate: `${dayNumber}-${selectedMonth.value + 1}-${selectedYear.value}`,
            declined: false,
          },
      );
    };


    return {
      /* Component properties */
      isModalOpen,
      modalData,
      openModal,
      dayOffRequestedDay,
      dayOffRequestedDays,
      dayOffRequestedDayStatus,
      alreadyHavePendingRequestAtDate,
      dateAlreadyPassed,
      dateIsCurrentDate,
      getTextColorFromRequestStatus,
      getIconFromRequestStatus,

      /* Event handlers */
      showDayOffRequestModal,
      getDaysInAMonth,

      /* Icons */
    };
  },
});

</script>
<style scoped>
.day-off-button:active {
  opacity: 0.8;
  background: var(--user-selected-color);
}
</style>
