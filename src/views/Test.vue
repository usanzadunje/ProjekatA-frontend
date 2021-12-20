<template>
  <ion-page>
    <ion-content>
      <TheUserHeader
          id="asdasd"
          v-show="true"
          :main-heading="$t('findAvailablePlace')"
      />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonPage,
} from '@ionic/vue';

import {
  locationOutline,
}                    from 'ionicons/icons';
import TheUserHeader from '@/components/user/headers/TheUserHeader';

export default {
  components: {
    IonContent,
    IonPage,
    TheUserHeader,
  },
  setup() {


    return {
      locationOutline,
    };
  },
};
</script>
<style scoped>

</style>