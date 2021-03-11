<template>
  <ion-app>
    <ion-router-outlet/>
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent }         from 'vue';
import LocalNotificationService    from '@/services/LocalNotificationService';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
  created() {
    LocalNotificationService.registerLocalNotifications();
  },
});
</script>