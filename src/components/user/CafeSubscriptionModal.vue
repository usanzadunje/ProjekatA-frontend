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
          :disabled="indefiniteTimerActive"
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
          @click="subscribe(cafe.id, notificationTime);$emit('userSubscribedToCafe');"
      >
        <ion-icon slot="start" :icon="isUserSubscribed ? notificationsReceivedOutline : notificationsOutlineWhite"></ion-icon>
        {{ isUserSubscribed ? 'Ukloni' : 'Potvrdi' }}
      </ion-button>
    </div>
  </ion-content>
</template>

<script>
import { defineComponent, ref, toRef } from 'vue';
import {
  IonContent,
  IonItem,
  IonIcon,
  IonButton,
  IonToggle,
  IonRange,
}                               from '@ionic/vue';
import {
  notificationsOutlineWhite,
  notificationsReceivedOutline,
}                               from '@/assets/icons';
import { useFCM }               from '@/composables/useFCM';
import CafeService              from '@/services/CafeService';

export default defineComponent({
  name: 'ShortCafeModal',
  components: {
    IonContent,
    IonItem,
    IonIcon,
    IonButton,
    IonToggle,
    IonRange,
  },
  props: {
    cafe: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismissSubscriptionModal', 'userSubscribedToCafe'],
  setup(props) {
    /* Properties */
    let notificationTime = ref(15);
    let indefiniteTimerActive = ref(false);

    const isUserSubscribed = ref(false);

    const cafe = toRef(props, 'cafe')

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
    const { initPush } = useFCM();
    initPush();

    /* Adding pair of user/cafe in database corresponding to authenticated user subscribed to certain cafe */
    const subscribe = (cafeId, $notificationTime = null) => {
      if(indefiniteTimerActive.value) {
        $notificationTime = null;
      }
      CafeService.subscribe(cafeId, $notificationTime)
                 .then(() => {
                   alert(`Successfully subscribed!`);
                   isUserSubscribed.value = !isUserSubscribed.value;
                 })
                 .catch((error) => alert(error));
    };


    return {
      /* Properties */
      notificationTime,
      indefiniteTimerActive,
      isUserSubscribed,

      /* Event handlers */
      indefiniteTimerToggle,

      /* Methods */
      subscribe,

      /* Icons */
      notificationsOutlineWhite,
      notificationsReceivedOutline,

    };
  },
});
</script>
<style scoped>
ion-toggle {
  --background: #C1C9D2;
  --background-checked: #1B6DE0;
  --handle-height: 13px;
  --handle-width: 13px;
  --handle-spacing: 3px;
  --handle-background-checked: #FFF;
  height: 19px;
}

ion-range {
  --bar-background: #F6F7FB;
  --bar-background-active: #1B6DE0;
  --knob-background: #1B6DE0;
  --bar-height: 6px;
  --knob-size: 21px;
}
</style>