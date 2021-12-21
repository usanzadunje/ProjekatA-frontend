<template>
  <div class="px-4 xs:px-6 pt-4 safe-pb">
    <div class="mt-2">
      <h1 class="submodal-heading">{{ $t('notification', 2) }}</h1>
    </div>
    <div class="mt-4">
      <p class="submodal-paragraph">
        {{ $t('notificationModal1') }}
        <span class="submodal-paragraph-meidum">{{ place.name }}</span>
        {{ $t('notificationModal2') }}
      </p>
    </div>
    <div class="mt-6 flex items-center">
      <ion-toggle
          mode="md"
          :disabled="isUserSubscribed"
          class="pl-4"
          @ionChange="indefiniteTimerToggle"
      ></ion-toggle>
      <ion-label class="ml-2 submodal-fade-text">{{ $t('indefinitely') }}</ion-label>
    </div>
    <div class="mt-4 flex items-center">
      <ion-range
          v-model="notificationTime"
          min="5"
          max="60"
          step="5"
          color="primary"
          :disabled="indefiniteTimerActive || isUserSubscribed"
      ></ion-range>
      <ion-label
          class="ml-4 submodal-alert-time flex-shrink-0"
          :style="indefiniteTimerActive ? 'font-size: 1.75rem !important' : ''"
      >
        {{ !indefiniteTimerActive ? notificationTime + 'min' : '∞' }}
      </ion-label>
    </div>
    <div class="mt-2 mb-3 flex justify-around gap-2">
      <ion-button
          :disabled="loading"
          class="uppercase button-cancel modal-button-border w-1/2"
          @click="$emit('dismiss')"
      >
        {{ $t('cancel') }}
      </ion-button>
      <ion-button
          :disabled="loading"
          class="uppercase button-confirm modal-button-border w-1/2"
          @click="toggleSubscription"
      >
        <ion-icon
            slot="start"
            :icon="isUserSubscribed ? notifications : notificationsOutline"
        ></ion-icon>
        {{ isUserSubscribed ? $t('remove') : $t('confirm') }}
      </ion-button>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref, toRefs } from 'vue';
import { useStore }                               from 'vuex';
import { useI18n }                                from 'vue-i18n';
import {
  IonIcon,
  IonButton,
  IonToggle,
  IonRange,
  IonLabel,
  alertController,
}                                                 from '@ionic/vue';

import PlaceService from '@/services/PlaceService';

import { useFCM }           from '@/composables/useFCM';
import { useErrorHandling } from '@/composables/useErrorHandling';

import {
  notifications,
  notificationsOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'PlaceSubscriptionModal',
  components: {
    IonIcon,
    IonButton,
    IonToggle,
    IonRange,
    IonLabel,
  },
  props: {
    place: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismiss'],
  setup(props) {
    /* Global properties */
    const store = useStore();
    const { t } = useI18n();

    /* Component properties */
    const { place } = toRefs(props);
    const notificationTime = ref(15);
    const indefiniteTimerActive = ref(false);
    const isUserSubscribed = computed(() => store.getters['user/isSubscribedTo'](place.value.id));
    const loading = ref(false);

    /* Composables */
    const { registerToken } = useFCM();
    const { tryCatch } = useErrorHandling();

    /* Methods */
    const subscribe = async() => {
      const notifyIn = indefiniteTimerActive.value ? '' : notificationTime.value;

      await tryCatch(
          async() => {
            await PlaceService.subscribe(place.value.id, notifyIn);

            store.commit("user/ADD_SUBSCRIPTION", place.value.id);
          },
          {
            successMessageKey: 'successSubscribe',
            errorMessageKey: 'generalAlertError',
            successMessageParams: {
              place: place.value.name,
            },
          },
      );
    };
    const showAlert = async() => {
      const alert = await alertController
          .create({
            header: t('alertNotificationsOffHeader'),
            message: t('alertNotificationsOffMessage'),
            buttons: [
              {
                text: t('no'),
                role: 'cancel',
                handler: () => {
                  loading.value = false;
                },
              },
              {
                text: t('yes'),
                handler: async() => {
                  await tryCatch(
                      async() => {
                        await registerToken();
                        await subscribe(place.value.id);
                        await store.dispatch('user/setNotifications', true);
                      },
                      {
                        errorMessageKey: 'generalAlertError',
                      },
                  );
                  loading.value = false;
                },
              },
            ],
          });
      await alert.present();
    };

    /* Lifecycle hooks */

    /* Event Handlers */
    const indefiniteTimerToggle = (e) => {
      indefiniteTimerActive.value = e.target.checked;
    };
    /* Adding pair of users/place in database corresponding to authenticated users subscribed to certain place */
    const toggleSubscription = async() => {
      loading.value = true;

      if(indefiniteTimerActive.value) {
        notificationTime.value = 15;
      }

      if(isUserSubscribed.value) {
        await tryCatch(
            async() => {
              await PlaceService.unsubscribe(place.value.id);

              store.commit("user/REMOVE_SUBSCRIPTION", place.value.id);
            },
            {
              successMessageKey: 'successUnsubscribe',
              errorMessageKey: 'generalAlertError',
              successMessageParams: {
                place: place.value.name,
              },
            },
        );
      }else {
        if(!store.getters['user/notifications']) {
          await showAlert(place.value.id);
          return;
        }
        await subscribe(place.value.id);
      }

      loading.value = false;
    };


    return {
      /* Component properties */
      notificationTime,
      indefiniteTimerActive,
      isUserSubscribed,
      loading,

      /* Event handlers */
      indefiniteTimerToggle,
      toggleSubscription,


      /* Icons */
      notifications,
      notificationsOutline,

    };
  },
});
</script>
<style scoped>
ion-toggle {
  padding: 0 !important;
}

ion-range {
  padding: 0 !important;
  --bar-height: 6px;
  --knob-size: 21px;
}

ion-range::part(knob) {
  outline: none !important;
  background: var(--primary-button) !important;
}

ion-range::part(bar-active) {
  background: var(--primary-button) !important;
}
</style>