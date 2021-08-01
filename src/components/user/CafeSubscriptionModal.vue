<template>
  <ion-content>
    <div id="cafeSubModal" class="absolute bottom-0 w-full ion-padding">
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
          {{ !isNaN(notificationTime) ? notificationTime + 'min' : '∞' }}
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
        >
          <ion-icon slot="start"
                    :icon="isUserSubscribed ? notifications : notificationsOutline"></ion-icon>
          {{ isUserSubscribed ? $t('remove') : $t('confirm') }}
        </ion-button>
      </div>
    </div>

  </ion-content>
</template>

<script>
import { defineComponent, ref, toRef, onMounted } from 'vue';

import { useStore } from 'vuex';

import {
  IonContent,
  IonItem,
  IonIcon,
  IonButton,
  IonToggle,
  IonRange,
  IonLabel, alertController,
} from '@ionic/vue';

import {
  notifications,
  notificationsOutline,
} from 'ionicons/icons';

import { useStorage } from '@/services/StorageService';

import CafeService               from '@/services/CafeService';
import { useToastNotifications } from '@/composables/useToastNotifications';
import { useFCM }                from '@/composables/useFCM';

import { useI18n } from 'vue-i18n';

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
    let notificationTime = ref(15);
    let indefiniteTimerActive = ref(false);

    const isUserSubscribed = ref(false);

    const cafe = toRef(props, 'cafe');

    /* Methods */
    const { showSuccessToast, showErrorToast } = useToastNotifications();
    const { get, set } = useStorage();
    const { initPush } = useFCM();
    const showAlert = async(cafeId) => {
      const alert = await alertController
          .create({
            header: t('alertNotificationsOffHeader'),
            message: t('alertNotificationsOffMessage'),
            buttons: [
              {
                text: t('no'),
                role: 'cancel',
              },
              {
                text: t('yes'),
                handler: () => {
                  set(`areNotificationsOn.${store.getters['auth/authUser'].id}`, true);
                  initPush();
                  CafeService.subscribe(cafeId, notificationTime.value)
                             .then(async(response) => {
                               if(response.data) {
                                 isUserSubscribed.value = true;
                                 emit('userToggledSubscription');
                                 await showSuccessToast(t('successSubscribe'));
                               }
                             })
                             .catch(() => {
                               showErrorToast(
                                   null,
                                   {
                                     generalError: t('generalAlertError'),
                                   });
                             });
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
                 isUserSubscribed.value = !!response.data;
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
        const height = document.querySelector('#cafeSubModal').getClientRects()[0].height;
        document.querySelector('.custom-sub-modal .modal-wrapper').style.height = height + 'px';
      }, 300);
    });

    /* Event Handlers */
    const indefiniteTimerToggle = (e) => {
      indefiniteTimerActive.value = e.target.checked;
    };
    /* Adding pair of user/cafe in database corresponding to authenticated user subscribed to certain cafe */
    const toggleSubscription = async(cafeId) => {
      let pushNotificationPermission = await get(`areNotificationsOn.${store.getters['auth/authUser'].id}`) ?? false;

      if(indefiniteTimerActive.value) {
        notificationTime.value = null;
      }

      if(isUserSubscribed.value) {
        CafeService.unsubscribe(cafeId)
                   .then(async(response) => {
                     if(response.data) {
                       isUserSubscribed.value = false;
                       emit('userToggledSubscription');
                       emit('userUnsubscribed');
                       await showSuccessToast(t('successUnsubscribe'));
                     }
                   })
                   .catch(() => {
                     showErrorToast(
                         null,
                         {
                           generalError: t('generalAlertError'),
                         });
                   });
      }else {
        if(!pushNotificationPermission) {
          await showAlert(cafeId);
          return;
        }
        CafeService.subscribe(cafeId, notificationTime.value)
                   .then(async(response) => {
                     if(response.data) {
                       isUserSubscribed.value = true;
                       emit('userToggledSubscription');
                       await showSuccessToast(t('successSubscribe'));
                     }
                   })
                   .catch(() => {
                     showErrorToast(
                         null,
                         {
                           generalError: t('generalAlertError'),
                         });
                   });
      }

    };


    return {
      /* Component properties */
      notificationTime,
      indefiniteTimerActive,
      isUserSubscribed,

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