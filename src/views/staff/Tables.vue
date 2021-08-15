<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Tables</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div v-for="table in state.tables" :key="table.id">
        {{ table.serial_number }}
        <ion-button size="small" color="primary" @click="toggle(table.id)">Toggle</ion-button>
      </div>
      <ion-button color="warning" routerLink="/staff/dashboard">Home</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonButton } from '@ionic/vue';
import TableService                                                        from '@/services/TableService';
import { reactive }                                                        from 'vue';
import { useStore }                                                        from 'vuex';

export default {
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
    IonButton,
  },
  setup() {
    const store = useStore()
    const state = reactive({ tables: [] });

    /* Changing tables availability */
    const toggle = (tableId) => {
      TableService.toggle(tableId).then(() => {
      }).catch((error) => alert(error));
    };

    /* Fetching all tables for specific cafe  */
    TableService.index(store.getters["auth/authUser"].cafe_id).then((response) => state.tables = response.data.tables);

    return {
      state,
      toggle,
    };
  },

};
</script>