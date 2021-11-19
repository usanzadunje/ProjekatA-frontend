<template>
  <div>
    <div>
      <ion-item
          v-if="!scheduleData.staff"
          lines="none"
          class="flex rounded-2xl h-11"
          :class="{ 'error-border' : errorNames.hasOwnProperty('user_id') }"
      >
        <ion-label class="ion-select-label">{{ $t('chooseStaff') }}</ion-label>
        <ion-select
            v-model="schedule.user_id"
            :value="scheduleData.staff?.id"
            :cancel-text="$t('cancel')"
            :ok-text="$t('confirm')"
            :interface-options="customAlertOptions"
        >
          <ion-select-option
              v-for="employee in staff"
              :key="employee.id"
              :value="employee.id"
          >
            {{ getDisplayNameForUser(employee) }}
          </ion-select-option>
        </ion-select>

      </ion-item>
      <ion-item
          v-else
          lines="none"
          class="flex rounded-2xl h-11"
          :class="{ 'error-border' : errorNames.hasOwnProperty('user_id') }"
      >
        <ion-icon :icon="personOutline" class="mr-2 text-xl text-gray-500"></ion-icon>

        <ion-input
            :value="getDisplayNameForUser(scheduleData.staff)"
            disabled
        ></ion-input>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5"
          :class="{ 'error-border' : errorNames.hasOwnProperty('start_time') }"
      >
        <ion-label class="settings-fade-text">{{ $t('startWorkTime') }}</ion-label>
        <ion-datetime
            v-model="schedule.start_time"
            :doneText="$t('choose')"
            :cancelText="$t('cancel')"
            display-format="HH:mm"
            value="00:00"
            :placeholder="$t('selectTime')"
        ></ion-datetime>
      </ion-item>
      <ion-item
          lines="none"
          class="flex rounded-2xl h-11 mt-3.5"
          :class="{ 'error-border' : errorNames.hasOwnProperty('number_of_hours') }"
      >
        <ion-icon :icon="timeOutline" class="mr-2 text-xl text-gray-500"></ion-icon>

        <ion-input
            v-model.number="schedule.number_of_hours"
            type="number"
            debounce="100"
            :placeholder="$t('numberOfHours')"
            required
            @keyup.enter="addEmployeeToSchedule"
        ></ion-input>
      </ion-item>
    </div>

    <div class="mt-4">
      <ion-button
          :disabled="loading"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white relative"
          @click="addEmployeeToSchedule"
      >
        {{ loading ? $t('checking') : (scheduleData.staff ? $t('update') : $t('add')) }}
        <ion-spinner v-if="loading" name="crescent" class="absolute right-0"></ion-spinner>
      </ion-button>
      <ion-button
          :disabled="loading"
          fill="clear"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-black mt-4"
          @click="$emit('dismiss')"
      >
        {{ $t('cancel') }}
      </ion-button>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import {
  IonItem,
  IonIcon,
  IonInput,
  IonLabel,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSpinner,
}                                                                      from '@ionic/vue';
import { useI18n }                                                     from 'vue-i18n';
import { useStore }                                                    from 'vuex';
import { useErrorHandling }                                            from '@/composables/useErrorHandling';

import { getDisplayNameForUser } from '@/utils/helpers';

import {
  personOutline,
  timeOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: "AddEditStaffScheduleForm",
  components: {
    IonItem,
    IonIcon,
    IonInput,
    IonLabel,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonSpinner,
  },
  props: {
    startDate: {
      type: String,
      default: null,
      required: true,
    },
    scheduleData: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    /* Global properties and methods */
    const store = useStore();

    /* Composables */
    const { t } = useI18n();
    const { tryCatch, errorNames } = useErrorHandling();

    /* Component properties */
    const { scheduleData } = toRefs(props);
    const loading = ref(false);
    const schedule = reactive({
      start_date: props.startDate,
    });
    const customAlertOptions = {
      header: t('staff'),
      subHeader: t('chooseStaff'),
      translucent: true,
      cssClass: 'custom-select-alert',
    };
    const staff = computed(() => store.getters['owner/staff']);
    const employeeInput = ref();
    const timeInput = ref();
    const numberOfHoursInput = ref();

    /* Methods */

    /* Lifecycle hooks */
    onMounted(() => {
      if(scheduleData.value.staff) {
        schedule.start_time = scheduleData.value.start_time;
        schedule.number_of_hours = scheduleData.value.number_of_hours;
        schedule.user_id = scheduleData.value.staff.id;
      }
    });

    /* Methods */

    /* Event handlers */
    const addEmployeeToSchedule = async() => {
      loading.value = true;

      await tryCatch(
          async() => {
            if(scheduleData.value.staff) {
              await store.dispatch('owner/updateEmployeeSchedule', {
                id: scheduleData.value.id,
                payload: schedule,
              });
            }else {
              await store.dispatch('owner/addEmployeeToSchedule', schedule);
            }

            emit('dismiss');
          },
          scheduleData.value ? 'owner.successUpdateStaffSchedule' : 'owner.successAddStaffToSchedule',
          null,
          null,
          {
            staff: getDisplayNameForUser(staff.value.find(staff => staff.id === schedule.user_id)),
          },
      );

      loading.value = false;
    };
    /* Watchers */


    return {
      /* Global properties */

      /* Component properties */
      loading,
      schedule,
      customAlertOptions,
      staff,
      getDisplayNameForUser,
      errorNames,
      employeeInput,
      timeInput,
      numberOfHoursInput,

      /* Event handlers  */
      addEmployeeToSchedule,

      /* Icons */
      personOutline,
      timeOutline,
    };
  },
});
</script>
<style scoped>
ion-select::part(text) {
  font-size: 0.95rem !important;
  font-weight: 500;
  color: var(--primary-heading) !important;
  opacity: 0.8;
}
</style>