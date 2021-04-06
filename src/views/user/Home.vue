<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <GreetingNotificationToolbar/>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="p-6">
        Content
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent }         from 'vue';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
}                                  from '@ionic/vue';
import GreetingNotificationToolbar from '@/components/user/GreetingNotificationToolbar';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    GreetingNotificationToolbar,
  },
  setup() {

  },
});
</script>
<style scoped>

</style>