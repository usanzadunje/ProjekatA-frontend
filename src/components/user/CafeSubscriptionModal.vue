<template>
  <ion-content
      class="ion-padding"
  >
    <div class="relative w-full container-modal">
      <div class="absolute w-full top-3">
        <ion-item>
          <h1 class="submodal-heading">Notifikacije</h1>
        </ion-item>
        <ion-item>
          <p class="submodal-paragraph">
            Obavesti me ukoliko se oslobodi sto u objektu
            <span class="submodal-paragraph-meidum">{{ cafe.name }}</span>
            u narednih :
          </p>
        </ion-item>
        <ion-item class="ion-no-padding mt-4">
          <ion-toggle
              class="pl-4"
              @ionChange="indefiniteTimerToggle($event)"
              mode="md"
              :disabled="isUserSubscribed"
          ></ion-toggle>
          <ion-label class="margin-left-1 submodal-fade-text">Neodredjeno</ion-label>
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
            Otkazi
          </ion-button>
          <ion-button
              class="uppercase button-confirm modal-button-border"
              @click="toggleSubscription(cafe.id)"
          >
            <ion-icon slot="start"
                      :icon="isUserSubscribed ? notifications : notificationsOutline"></ion-icon>
            {{ isUserSubscribed ? 'Ukloni' : 'Potvrdi' }}
          </ion-button>
        </div>
      </div>
    </div>

  </ion-content>
</template>

<script>
import { defineComponent, ref, toRef } from 'vue';

import { useStore } from 'vuex';

import {
  IonContent,
  IonItem,
  IonIcon,
  IonButton,
  IonToggle,
  IonRange,
  IonLabel,
} from '@ionic/vue';

import {
  notifications,
  notificationsOutline,
} from 'ionicons/icons';

import { useFCM } from '@/composables/useFCM';

import CafeService               from '@/services/CafeService';
import { useToastNotifications } from '@/composables/useToastNotifications';

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
  emits: ['dismissSubscriptionModal', 'userToggledSubscription'],
  setup(props, { emit }) {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    let notificationTime = ref(15);
    let indefiniteTimerActive = ref(false);

    const isUserSubscribed = ref(false);

    const cafe = toRef(props, 'cafe');

    /* Methods */
    /* Method for initializing push notifications for mobile devices */
    const { initPush } = useFCM(store.getters['auth/authUser'].id);
    const { showSuccessToast } = useToastNotifications();

    /* Lifecycle hooks */
    //When user lands on page check if he is already subscribed to cafe
    CafeService.isUserSubscribed(cafe.value.id)
               .then((response) => {
                 isUserSubscribed.value = !!response.data;
               })
               .catch((error) => alert(error));

    /* Event Handlers */
    const indefiniteTimerToggle = (e) => {
      indefiniteTimerActive.value = e.target.checked;
    };
    /* Adding pair of user/cafe in database corresponding to authenticated user subscribed to certain cafe */
    const toggleSubscription = async(cafeId) => {
      let pushNotificationPermission = await initPush(isUserSubscribed.value);

      if(indefiniteTimerActive.value) {
        notificationTime.value = null;
      }

      if(!pushNotificationPermission){
        return;
      }

      if(isUserSubscribed.value) {
        CafeService.unsubscribe(cafeId)
                   .then(async(response) => {
                     if(response.data) {
                       isUserSubscribed.value = false;
                       emit('userToggledSubscription');
                       await showSuccessToast('Successfully unsubscribed!')
                     }
                   })
                   .catch((error) => alert(error));
      }else {
        CafeService.subscribe(cafeId, notificationTime.value)
                   .then(async(response) => {
                     if(response.data) {
                       isUserSubscribed.value = true;
                       emit('userToggledSubscription');
                       await showSuccessToast('Successfully subscribed!')
                     }
                   })
                   .catch((error) => alert(error));
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
</style>