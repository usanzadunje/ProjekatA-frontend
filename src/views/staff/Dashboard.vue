<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <StaffHeader @click="this.$store.commit('staff/TOGGLE_MENU_VISIBILITY')"/>
    </ion-content>
  </ion-page>
</template>

<script>
import { ref }                 from 'vue';
import { IonPage, IonContent } from '@ionic/vue';

import StaffHeader from '@/components/staff/StaffHeader';

export default {
  name: "Home",
  components: {
    IonPage,
    IonContent,
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