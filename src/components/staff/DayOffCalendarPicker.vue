<template>
  <div>
    <div class="grid grid-cols-auto gap-1 px-2">
      <div
          v-for="dayNumber in getDaysInAMonth(selectedMonth)"
          :key="dayNumber"
          :style="dayOffRequestedDays(selectedYear, selectedMonth).includes(dayNumber) ? 'color: #ffa500' : ''"
          class="h-16 p-1 relative primary-text-color"
          :class="{
              'user-selected-paint':
              dayNumber === new Date().getDate() &&
              selectedMonth === new Date().getMonth() &&
              selectedYear === new Date().getFullYear(),
              'day-off-button border border-user-selected-color':
              (
                  dayNumber >= new Date().getDate() &&
                  selectedMonth === new Date().getMonth() &&
                  selectedYear === new Date().getFullYear()
              ) ||
              (selectedMonth > new Date().getMonth() && selectedYear === new Date().getFullYear()) ||
              selectedYear > new Date().getFullYear(),
              'opacity-30':
              (
                  dayNumber < new Date().getDate() &&
                  selectedMonth === new Date().getMonth() &&
                  selectedYear === new Date().getFullYear()
              ) ||
              (selectedMonth < new Date().getMonth() && selectedYear === new Date().getFullYear()) ||
              selectedYear < new Date().getFullYear(),
            }"
          @click="showDayOffRequestModal($event, dayNumber)"
      >
        <div
            class="absolute"
        >
          {{ dayNumber }}
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
      <DayOffRequestModal
          :day-off-start-date="modalData"
          @dismiss="openModal(false)"
      />
    </AppModal>
  </div>
</template>

<script>
import { defineComponent, toRefs } from 'vue';
import { useI18n }                 from 'vue-i18n';

import AppModal           from '@/components/AppModal';
import DayOffRequestModal from '@/components/staff/modals/DayOffRequestModal';

import { useModal }              from '@/composables/useModal';
import { useToastNotifications } from '@/composables/useToastNotifications';
import { useDaysOffRequest }     from '@/composables/useDaysOffRequest';

import { getDaysInAMonth } from '@/utils/helpers';

export default defineComponent({
  name: 'DayOffCalendarPicker',
  components: {
    AppModal,
    DayOffRequestModal,
  },
  props: {
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
    const { showErrorToast } = useToastNotifications();
    const { t } = useI18n();
    const { dayOffRequestedDays } = useDaysOffRequest();

    /* Event handlers */
    const showDayOffRequestModal = (event, dayNumber) => {
      const dt = new Date();

      if(
          dayOffRequestedDays(selectedYear.value, selectedMonth.value).includes(dayNumber) ||
          (
              dayNumber < dt.getDate() &&
              selectedMonth.value === dt.getMonth() &&
              selectedYear.value === dt.getFullYear()
          ) ||
          (selectedMonth.value < dt.getMonth() && selectedYear.value === dt.getFullYear()) ||
          selectedYear.value < dt.getFullYear()
      ) {
        showErrorToast(
            null,
            {
              invalidDate: dayOffRequestedDays(selectedYear.value, selectedMonth.value).includes(dayNumber) ?
                  t('alreadyRequestedDay') : t('requestedDayPassed'),
            },
        );
        return;
      }

      openModal(
          true,
          `${dayNumber}-${selectedMonth.value + 1}-${selectedYear.value}`,
      );
    };


    return {
      /* Component properties */
      isModalOpen,
      modalData,
      openModal,
      dayOffRequestedDays,

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
