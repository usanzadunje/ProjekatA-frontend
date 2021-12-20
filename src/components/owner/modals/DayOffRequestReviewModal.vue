<template>
  <div class="p-4 staff-modal-bg">
    <div class="flex w-full justify-center items-center">
      <span
          class="font-bold text-gray-400"
      >
        STATUS: &nbsp;
      </span>
      <RequestStatusText
          :status="requestData.status"
          class="font-bold uppercase"
      />
    </div>
    <div class="mt-4 px-2">
      <ion-item
          lines="none"
          class="rounded-2xl h-11"
      >
        <ion-icon
            slot="start"
            :icon="personOutline"
            class="mr-2 text-xl text-gray-500"
        ></ion-icon>

        <ion-input
            :value="staffDisplayName"
            type="text"
            disabled
        ></ion-input>
      </ion-item>
      <ion-item
          lines="none"
          class="rounded-2xl mt-3.5"
      >
        <ion-icon
            slot="start"
            :icon="calendarNumberOutline"
            class="mr-2 text-xl text-gray-500"
        ></ion-icon>

        <p class="w-full padding-y text">
          {{ `${$t('start')}: ${(requestData.start_date)}` }}
        </p>
      </ion-item>
      <ion-item
          lines="none"
          class="rounded-2xl mt-3.5"
      >
        <ion-icon
            slot="start"
            :icon="calendarNumberOutline"
            class="mr-2 text-xl text-gray-500"
        ></ion-icon>

        <p class="w-full padding-y text">
          {{ `${$t('end')}: ${(requestData.end_date)}` }}
        </p>
      </ion-item>
      <div class="w-full text-center mt-3.5">
        <span class="text">
          {{ $t('message') }}
        </span>
      </div>
      <ion-item
          lines="none"
          class="rounded-2xl"
      >
        <p class="padding-y text break-words">
          {{ requestData.message || $t('noMessage') }}
        </p>
      </ion-item>
    </div>
    <div class="mt-8 px-2 flex justify-between items-center">
      <ion-button
          :disabled="requestData.status === APPROVED"
          size="large"
          expand="block"
          class="w-1/2 auth-button-border-radius uppercase btn-bg-success font-bold text-lg relative"
          @click="approveRequest(requestData.id, staffDisplayName)"
      >
        {{ $t('approve') }}
      </ion-button>
      <ion-button
          :disabled="requestData.status === DECLINED"
          size="large"
          expand="block"
          class="w-1/2 auth-button-border-radius uppercase btn-bg-danger font-bold text-lg relative"
          @click="declineRequest(requestData.id, staffDisplayName)"
      >
        {{ $t('decline') }}
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, onUnmounted } from 'vue';
import { useRoute, useRouter }          from 'vue-router';
import {
  IonItem,
  IonIcon,
  IonInput,
  IonButton,
}                                       from '@ionic/vue';

import RequestStatusText from '@/components/staff/RequestStatusText';

import { getDisplayNameForUser } from '@/utils/helpers';

import {
  personOutline,
  calendarNumberOutline,
}                            from 'ionicons/icons';
import { useDaysOffRequest } from '@/composables/useDaysOffRequest';

export default defineComponent({
  name: 'DayOffRequestReviewModal',
  components: {
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
    RequestStatusText,
  },
  props: {
    requestData: {
      type: Object,
      default: null,
      required: true,
    },
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    /* Global properties */
    const router = useRouter();
    const route = useRoute();

    /* Component properties */
    const staffDisplayName = getDisplayNameForUser(props.requestData.staff);

    /* Lifecycle hooks */
    onUnmounted(() => {
      if(route.query.id) {
        router.replace();
      }
    });

    /* Composables */
    const {
      DECLINED,
      APPROVED,
      approveRequest,
      declineRequest,
    } = useDaysOffRequest();

    /* Event handlers */
    const dismiss = () => {
      emit('dismiss');
    };

    return {
      /* Component properties */
      staffDisplayName,
      DECLINED,
      APPROVED,

      /* Event handlers */
      dismiss,
      approveRequest,
      declineRequest,

      /* Icons */
      personOutline,
      calendarNumberOutline,
    };
  },
});
</script>

<style scoped>
ion-input {
  font-size: 1rem !important;
  color: var(--primary-heading) !important;
}

.padding-y {
  padding: 10px 0;
}

.text {
  font-size: 1rem;
  color: var(--primary-heading) !important;
  opacity: 0.5;
}
</style>