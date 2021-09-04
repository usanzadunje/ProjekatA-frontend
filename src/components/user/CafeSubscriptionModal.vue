<template>
  <ion-content scrollY="false">
    <div ref="content" class="absolute bottom-0 w-full ion-padding">
      <ion-item>
        <h1 class="submodal-heading">{{ $t('notifications') }}</h1>
      </ion-item>
      <ion-item>
        <p class="submodal-paragraph">
          {{ $t('notificationModal1') }}
          <span class="submodal-paragraph-meidum">{{ cafe.name }}</span>
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
        <ion-label class="margin-left-1 submodal-fade-text">{{ $t('undefined') }}</ion-label>
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
            @click="toggleSubscription(cafe.id)"
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

  </ion-content>
</template>

<script>
import { defineComponent, ref, toRef, onMounted } from 'vue';
import { useStore }                               from 'vuex';
import { useI18n }                                from 'vue-i18n';
import {
  IonContent,
  IonItem,
  IonIcon,
  IonButton,
  IonToggle,
  IonRange,
  IonLabel,
  alertController,
}                                                 from '@ionic/vue';

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
    IonContent,
    IonItem,
    IonIcon,
    IonButton,
    IonToggle,
    IonRange,
    IonLabel,
  },
  props: {
    cafe: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismissSubscriptionModal', 'userToggledSubscription', 'userUnsubscribed'],
  setup(props, { emit }) {
    /* Global properties */
    const store = useStore();
    const { t } = useI18n();

    /* Component properties */
    const notificationTime = ref(15);
    const indefiniteTimerActive = ref(false);
    const isUserSubscribed = ref(false);
    const cafe = toRef(props, 'cafe');
    const content = ref(null);
    const isSubButtonDisabled = ref(false);

    /* Composables */
    const { showSuccessToast, showErrorToast } = useToastNotifications();
    const { initPush } = useFCM();

    /* Methods */
    const subscribe = async(cafeId) => {
      const notifyIn = indefiniteTimerActive.value ? '' : notificationTime.value;
      try {
        await CafeService.subscribe(cafeId, notifyIn);
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
    const showAlert = async(cafeId) => {
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
                  await initPush();
                  await subscribe(cafeId);
                  await store.dispatch('user/setNotifications', true);
                },
              },
            ],
          });
      await alert.present();
    };

    /* Lifecycle hooks */
    //When user lands on page check if he is already subscribed to cafe
    CafeService.isUserSubscribed(cafe.value.id)
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
    onMounted(() => {
      setTimeout(() => {
        const height = content.value?.getBoundingClientRect()?.height || 320;
        document.documentElement.style.setProperty('--sub-modal-height', height + 'px');
      }, 400);
    });

    /* Event Handlers */
    const indefiniteTimerToggle = (e) => {
      indefiniteTimerActive.value = e.target.checked;
    };
    /* Adding pair of user/cafe in database corresponding to authenticated user subscribed to certain cafe */
    const toggleSubscription = async(cafeId) => {
      isSubButtonDisabled.value = true;

      if(indefiniteTimerActive.value) {
        notificationTime.value = 5;
      }

      if(isUserSubscribed.value) {
        try {
          await CafeService.unsubscribe(cafeId);
          isUserSubscribed.value = false;
          emit('userToggledSubscription');
          emit('userUnsubscribed');
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
          await showAlert(cafeId);
          isSubButtonDisabled.value = false;
          return;
        }
        await subscribe(cafeId);
      }
      isSubButtonDisabled.value = false;
    };


    return {
      /* Component properties */
      notificationTime,
      indefiniteTimerActive,
      isUserSubscribed,
      content,
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
ion-content {
  --background: var(--secondary-paint) !important;
}

ion-item {
  --background: var(--secondary-paint);
}

ion-range {
  --bar-background: #F6F7FB;
  --bar-background-active: #1B6DE0;
  --knob-background: #1B6DE0;
  --bar-height: 6px;
  --knob-size: 21px;
}

ion-range::part(knob) {
  outline: none !important;
}
</style>