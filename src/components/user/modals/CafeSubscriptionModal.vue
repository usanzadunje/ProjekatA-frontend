<template>
  <div class="px-4 pt-4">
    <ion-item>
      <h1 class="submodal-heading">{{ $t('notifications') }}</h1>
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
          class="pl-4"
          @ionChange="indefiniteTimerToggle($event)"
          mode="md"
          :disabled="isUserSubscribed"
      ></ion-toggle>
      <ion-label class="margin-left-1 submodal-fade-text">{{ $t('indefinitely') }}</ion-label>
    </ion-item>
    <ion-item class="ion-no-padding">
      <ion-range
          min="5"
          max="60"
          step="5"
          color="primary"
          v-model="notificationTime"
          :disabled="indefiniteTimerActive || isUserSubscribed"
      ></ion-range>
      <ion-label class="ml-1 margin-left-1 submodal-alert-time">
        {{ !indefiniteTimerActive ? notificationTime + 'min' : '∞' }}
      </ion-label>
    </ion-item>
    <div class="mt-2 mb-3 flex justify-around">
      <ion-button
          class="mr-2.5 uppercase button-cancel modal-button-border"
          @click="$emit('dismissSubscriptionModal')"
      >
        {{ $t('cancel') }}
      </ion-button>
      <ion-button
          class="uppercase button-confirm modal-button-border"
          @click="toggleSubscription(place.id)"
          :disabled="isSubButtonDisabled"
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
import { defineComponent, ref, toRef } from 'vue';
import { useStore }                    from 'vuex';
import { useI18n }                     from 'vue-i18n';
import {
  IonItem,
  IonIcon,
  IonButton,
  IonToggle,
  IonRange,
  IonLabel,
  alertController,
}                                      from '@ionic/vue';

import CafeService from '@/services/CafeService';

import { useToastNotifications } from '@/composables/useToastNotifications';
import { useFCM }                from '@/composables/useFCM';

import {
  notifications,
  notificationsOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'CafeSubscriptionModal',
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
  emits: ['dismissSubscriptionModal', 'userToggledSubscription'],
  setup(props, { emit }) {
    /* Global properties */
    const store = useStore();
    const { t } = useI18n();

    /* Component properties */
    const notificationTime = ref(15);
    const indefiniteTimerActive = ref(false);
    const isUserSubscribed = ref(false);
    const place = toRef(props, 'place');
    const isSubButtonDisabled = ref(false);

    /* Composables */
    const { showSuccessToast, showErrorToast } = useToastNotifications();
    const { registerToken } = useFCM();

    /* Methods */
    const subscribe = async(placeId) => {
      const notifyIn = indefiniteTimerActive.value ? '' : notificationTime.value;
      try {
        await CafeService.subscribe(placeId, notifyIn);
        isUserSubscribed.value = true;
        emit('userToggledSubscription');
        await showSuccessToast(t('successSubscribe'));
      }catch(error) {
        showErrorToast(
            null,
            {
              generalError: t('generalAlertError'),
            });
      }
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
              },
              {
                text: t('yes'),
                handler: async() => {
                  await registerToken();
                  await subscribe(placeId);
                  await store.dispatch('user/setNotifications', true);
                },
              },
            ],
          });
      await alert.present();
    };

    /* Lifecycle hooks */
    //When users lands on page check if he is already subscribed to place
    CafeService.isUserSubscribed(place.value.id)
               .then((response) => {
                 isUserSubscribed.value = !!response.data.subscribed;
               })
               .catch(() => {
                 showErrorToast(
                     null,
                     {
                       generalError: t('generalAlertError'),
                     });
               });

    /* Event Handlers */
    const indefiniteTimerToggle = (e) => {
      indefiniteTimerActive.value = e.target.checked;
      // document.querySelector('ion-range').classList.toggle('indefinite');
    };
    /* Adding pair of users/place in database corresponding to authenticated users subscribed to certain place */
    const toggleSubscription = async(placeId) => {
      isSubButtonDisabled.value = true;

      if(indefiniteTimerActive.value) {
        notificationTime.value = 15;
      }

      if(isUserSubscribed.value) {
        try {
          await CafeService.unsubscribe(placeId);
          isUserSubscribed.value = false;
          emit('userToggledSubscription');
          await showSuccessToast(t('successUnsubscribe'));
        }catch(error) {
          showErrorToast(
              null,
              {
                generalError: t('generalAlertError'),
              });
        }
      }else {
        if(!store.getters['user/notifications']) {
          await showAlert(placeId);
          isSubButtonDisabled.value = false;
          return;
        }
        await subscribe(placeId);
      }
      isSubButtonDisabled.value = false;
    };


    return {
      /* Component properties */
      notificationTime,
      indefiniteTimerActive,
      isUserSubscribed,
      isSubButtonDisabled,

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

ion-range::part(bar) {
  background: #C1C9D2 !important;
}

ion-range::part(bar-active) {
  background: var(--primary-button) !important;
}
</style>