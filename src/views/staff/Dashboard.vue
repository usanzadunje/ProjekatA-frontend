<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="bg-red-600 w-full h-11"
           @click="this.$store.commit('staff/SET_MENU_VISIBILITY', true)"
      >
        dsadasdaddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddsd
      </div>
      <button @click="$router.push({ name : 'staff.tables' })">CLICK ME TO GOddddddddddddddddddddddddddddddddddd
      </button>
    </ion-content>
  </ion-page>
</template>

<script>
import { ref } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';

export default {
  name: "Home",
  components: {
    IonPage,
    IonContent,
  },
  setup() {
    const toggle = ref(false);
    return {
      toggle,
    };
  },

};
</script>