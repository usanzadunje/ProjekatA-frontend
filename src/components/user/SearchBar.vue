<template>
  <div>
    <ion-searchbar animated></ion-searchbar>
  </div>
</template>

<script>
import { defineComponent }      from 'vue';
import { IonIcon }              from '@ionic/vue';
import { notificationsOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'GreetingNotificationToolbar',
  components: {
    IonIcon,
  },
  setup() {

    return {
      notificationsOutline,
    };
  },
});
</script>
