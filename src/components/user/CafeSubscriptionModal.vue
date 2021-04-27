<template>
  <ion-content
      class="ion-padding"
  >
    <ion-item class="mt-3">
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
      <ion-label class="ml-1 margin-left-1 submodal-alert-time">{{ notificationTime }}min</ion-label>
    </ion-item>
    <div class="mt-2 mb-3 flex justify-between">
      <ion-button
          class="uppercase button-cancel modal-button-border"
          @click="$emit('dismissSubscriptionModal')"
      >
        Otkazi
      </ion-button>
      <ion-button
          class="uppercase button-confirm modal-button-border"
          @click="toggleSubscription(cafe.id)"
      >
        <ion-icon slot="start"
                  :icon="isUserSubscribed ? notificationsReceivedOutline : notificationsOutlineWhite"></ion-icon>
        {{ isUserSubscribed ? 'Ukloni' : 'Potvrdi' }}
      </ion-button>
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
}                     from '@ionic/vue';
import {
  notificationsOutlineWhite,
  notificationsReceivedOutline,
}                     from '@/assets/icons';
import { useFCM }     from '@/composables/useFCM';
import CafeService    from '@/services/CafeService';

export default defineComponent({
  name: 'ShortCafeModal',
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
    /* Properties */
    let notificationTime = ref(15);
    let indefiniteTimerActive = ref(false);

    const isUserSubscribed = ref(false);

    const cafe = toRef(props, 'cafe');

    /* Lifecycle hooks */
    CafeService.isUserSubscribed(cafe.value.id)
               .then((response) => {
                 isUserSubscribed.value = !!response.data;
               })
               .catch((error) => alert(error));

    /* Event Handlers */
    const indefiniteTimerToggle = (e) => {
      indefiniteTimerActive.value = e.target.checked;
    };

    /* Methods */
    /* Method for initializing push notifications for mobile devices */
    const { initPush } = useFCM(store.getters['auth/authUser'].id);
    initPush();

    /* Adding pair of user/cafe in database corresponding to authenticated user subscribed to certain cafe */
    const toggleSubscription = (cafeId) => {
      if(indefiniteTimerActive.value) {
        notificationTime.value = null;
      }

      if(isUserSubscribed.value) {
        CafeService.unsubscribe(cafeId)
                   .then((response) => {
                     if(response.data) {
                       alert(`Successfully unsubscribed!`);
                       isUserSubscribed.value = false;
                       emit('userToggledSubscription');
                     }
                   })
                   .catch((error) => alert(error));
      }else {
        CafeService.subscribe(cafeId, notificationTime.value)
                   .then((response) => {
                     if(response.data) {
                       alert(`Successfully subscribed!`);
                       isUserSubscribed.value = true;
                       emit('userToggledSubscription');
                     }
                   })
                   .catch((error) => alert(error));
      }

    };


    return {
      /* Properties */
      notificationTime,
      indefiniteTimerActive,
      isUserSubscribed,

      /* Event handlers */
      indefiniteTimerToggle,
      toggleSubscription,


      /* Icons */
      notificationsOutlineWhite,
      notificationsReceivedOutline,

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