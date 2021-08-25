<template>
  <ion-page>
    <ion-header>
      <StaffHeader @click="this.$store.commit('staff/TOGGLE_MENU_VISIBILITY')"/>
    </ion-header>
    <ion-content :fullscreen="true">
      CONTENT
    </ion-content>
  </ion-page>
</template>

<script>
import { ref } from 'vue';
import {
  IonPage,
  IonContent,
  IonHeader,
}              from '@ionic/vue';

import StaffHeader from '@/components/staff/StaffHeader';

export default {
  name: "Home",
  components: {
    IonPage,
    IonContent,
    IonHeader,
    StaffHeader,
  },
  setup() {
    const toggle = ref(false);
    return {
      toggle,
    };
  },

};
</script>