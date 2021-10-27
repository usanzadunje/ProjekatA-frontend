<template>
  <div class="px-4 pt-4">
    <ion-item>
      <h1 class="submodal-heading">{{ $t('notification', 2) }}</h1>
    </ion-item>
    <ion-item>
      <p class="submodal-paragraph">
        {{ $t('notificationModal1') }}
        <span class="submodal-paragraph-meidum">{{ place.name }}</span>
        {{ $t('notificationModal2') }}
      </p>
    </ion-item>
    <ion-item class="ion-no-padding mt-4">
      <ion-toggle
          mode="md"
          :disabled="isUserSubscribed"
          class="pl-4"
          @ionChange="indefiniteTimerToggle($event)"
      ></ion-toggle>
      <ion-label class="margin-left-1 submodal-fade-text">{{ $t('indefinitely') }}</ion-label>
    </ion-item>
    <ion-item class="ion-no-padding">
      <ion-range
          v-model="notificationTime"
          min="5"
          max="60"
          step="5"
          color="primary"
          :disabled="indefiniteTimerActive || isUserSubscribed"
      ></ion-range>
      <ion-label class="ml-1 margin-left-1 submodal-alert-time">
        {{ !indefiniteTimerActive ? notificationTime + 'min' : '∞' }}
      </ion-label>
    </ion-item>
    <div class="mt-2 mb-3 flex justify-around">
      <ion-button
          :disabled="loading"
          class="mr-2.5 uppercase button-cancel modal-button-border"
          @click="$emit('dismiss')"
      >
        {{ $t('cancel') }}
      </ion-button>
      <ion-button
          :disabled="loading"
          class="uppercase button-confirm modal-button-border"
          @click="toggleSubscription(place.id)"
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
import { computed, defineComponent, ref } from 'vue';
import { useStore }                       from 'vuex';
import { useI18n }                        from 'vue-i18n';
import {
  IonItem,
  IonIcon,
  IonButton,
  IonToggle,
  IonRange,
  IonLabel,
  alertController,
}                                         from '@ionic/vue';

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
    IonItem,
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
    const notificationTime = ref(15);
    const indefiniteTimerActive = ref(false);
    const isUserSubscribed = computed(() => store.getters['user/isSubscribedTo'](props.place.id));
    const loading = ref(false);

    /* Composables */
    const { registerToken } = useFCM();
    const { tryCatch } = useErrorHandling();

    /* Methods */
    const subscribe = async(placeId) => {
      const notifyIn = indefiniteTimerActive.value ? '' : notificationTime.value;

      await tryCatch(
          async() => {
            await PlaceService.subscribe(placeId, notifyIn);

            store.commit("user/ADD_SUBSCRIPTION", placeId);
          },
          'successSubscribe',
          'generalAlertError',
      );
    };
    const showAlert = async(placeId) => {
      const alert = await alertController
          .create({
            header: t('alertNotificationsOffHeader'),
            message: t('alertNotificationsOffMessage'),
            mode: 'ios',
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
                        await subscribe(placeId);
                        await store.dispatch('user/setNotifications', true);
                      },
                      null,
                      'generalAlertError',
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
    const toggleSubscription = async(placeId) => {
      loading.value = true;

      if(indefiniteTimerActive.value) {
        notificationTime.value = 15;
      }

      if(isUserSubscribed.value) {
        await tryCatch(
            async() => {
              await PlaceService.unsubscribe(placeId);

              store.commit("user/REMOVE_SUBSCRIPTION", placeId);
            },
            'successUnsubscribe',
            'generalAlertError',
        );
      }else {
        if(!store.getters['user/notifications']) {
          await showAlert(placeId);
          return;
        }
        await subscribe(placeId);
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
ion-item {
  --background: var(--secondary-paint);
}

ion-range {
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