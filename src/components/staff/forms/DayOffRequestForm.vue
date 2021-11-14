<template>
  <div class="px-2">
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11"
        :class="{ 'error-border' : errorNames.hasOwnProperty('number_of_days') }"
    >
      <ion-icon :icon="calendarNumberOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          v-model.lazy.number="dayOffRequest.number_of_days"
          type="number"
          debounce="100"
          :placeholder="$t('numberOfDays')"
          :autofocus="true"
          :required="true"
          @keyup.enter="messageInput.$el?.setFocus()"
      ></ion-input>
    </ion-item>
    <ion-item
        lines="none"
        class="flex rounded-2xl mt-3.5"
        :class="{ 'error-border' : errorNames.hasOwnProperty('message') }"
    >
      <ion-textarea
          ref="messageInput"
          v-model="dayOffRequest.message"
          v-capitalize
          :placeholder="$t('message')"
          :autocapitalize="true"
          debounce="100"
          inputmode="text"
          required
          :rows="Math.ceil(dayOffRequest.message?.length / 24)"
      >
      </ion-textarea>
    </ion-item>

    <div class="mt-6">
      <ion-button
          :disabled="loading"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white relative"
          @click="createOrUpdate"
      >
        {{ loading ? $t('checking') : $t('requestDayOff') }}
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
import { defineComponent, reactive, ref } from 'vue';
import { useStore }                       from 'vuex';
import {
  IonItem,
  IonInput,
  IonTextarea,
  IonIcon,
  IonButton,
  IonSpinner,
}                                         from "@ionic/vue";

import { useErrorHandling }   from '@/composables/useErrorHandling';
import { hideNativeKeyboard } from '@/composables/useDevice';

import {
  chatbubbleEllipsesOutline,
  calendarNumberOutline,
}                            from 'ionicons/icons';
import { useDaysOffRequest } from '@/composables/useDaysOffRequest';

export default defineComponent({
  name: "DayOffRequestForm",
  components: {
    IonItem,
    IonInput,
    IonTextarea,
    IonIcon,
    IonButton,
    IonSpinner,
  },
  props: {
    dayOffStartDate: {
      type: String,
      default: '',
      required: true,
    },
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    /* Global properties and methods */
    const store = useStore();

    /* Component properties */
    const dayOffRequest = reactive({
      start_date: props.dayOffStartDate,
    });
    const loading = ref(false);
    const messageInput = ref();

    /* Lifecycle hooks */

    /* Composables */
    const { errorNames, tryCatch } = useErrorHandling();
    const { addDaysOffRequest } = useDaysOffRequest();

    /* Event handlers */
    const createOrUpdate = async() => {
      loading.value = true;
      await hideNativeKeyboard();

      await tryCatch(
          async() => {
            await addDaysOffRequest(dayOffRequest);

            emit('dismiss');
          },
          'successDayOffRequest',
          null,
          null,
          dayOffRequest.numberOfDays,
      );

      loading.value = false;
    };

    return {
      /* Global properties */
      store,

      /* Component properties */
      dayOffRequest,
      errorNames,
      loading,
      messageInput,

      /* Event handlers  */
      createOrUpdate,

      /* Icons */
      chatbubbleEllipsesOutline,
      calendarNumberOutline,
    };
  },
});
</script>
<style scoped>

</style>