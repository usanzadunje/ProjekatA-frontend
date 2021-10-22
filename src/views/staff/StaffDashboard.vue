<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-refresher pull-min="60" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>
      <div class="wrap">
        <h1 class="text-center uppercase secondary-heading">{{ $t('owner.currentAvailabilitySituation') }}</h1>

        <div class="mt-4">
          <TableContainer class="mt-2">
            <Table
                v-for="table in tables"
                :key="table.id"
                :empty="Number(table.empty)"
                :draggable="false"
                :style="
                      `position: absolute;
                      top: 0; left: 0;
                      transform:translate(${table.position.left}px, ${table.position.top}px)
                      `
                    "
                @click="toggle(table.id)"
            />
          </TableContainer>
        </div>
        <div
            :class="`
          flex ${ isOwner ? 'flex-col-reverse' : 'flex-col' } md:flex-row
          justify-start md:justify-around
          `"
        >
          <div
              v-if="this.$store.getters['auth/isOwner']"
              class="mt-10"
          >
            <h1 class="text-center uppercase secondary-heading">{{ $t('owner.currentActiveStaff') }}</h1>

            <StaffCard
                v-for="staff in activeStaff"
                :key="staff.id"
                :staff="staff"
                :button="false"
                class="mt-4"
            />
          </div>

          <StaffAvailabilityToggleButtons class="md:self-center md:w-1/2"/>

          <PlaceAvailabilityChart/>

        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { computed, defineComponent, onMounted } from 'vue';
import { useStore }                             from 'vuex';
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  onIonViewWillEnter,
}                                               from '@ionic/vue';

import TableContainer                 from '@/components/TableContainer';
import Table                          from '@/components/Table';
import StaffCard                      from '@/components/staff/cards/StaffCard';
import PlaceAvailabilityChart         from '@/components/staff/charts/PlaceAvailabilityChart';
import StaffAvailabilityToggleButtons from '@/components/staff/StaffAvailabilityToggleButtons';

import { usePlaceManipulation } from '@/composables/usePlaceManipulation';

import { Capacitor } from '@capacitor/core';

export default defineComponent({
  name: "StaffDashboard",
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    TableContainer,
    Table,
    StaffCard,
    StaffAvailabilityToggleButtons,
    PlaceAvailabilityChart,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const tables = computed(() => store.getters['owner/tables']);
    const activeStaff = computed(() => store.getters['owner/staff'].filter(staff => staff.active));
    const availabilityRatio = computed(() => store.getters['staff/availabilityRatio']);
    const isOwner = computed(() => store.getters['auth/isOwner']);

    /* Composables */
    const { toggle } = usePlaceManipulation();

    /* Lifecycle hooks */
    (async() => {
      await store.dispatch('owner/getTables');
    })();
    onMounted(async() => {
      await store.dispatch('staff/updatePlaceAvailability');
    });
    onIonViewWillEnter(async() => {
      if(!Capacitor.isNativePlatform()) {
        await store.dispatch('staff/updatePlaceAvailability');
      }
    });


    /* Event handlers */
    const refresh = async(event) => {
      await store.dispatch('owner/getTables');
      await store.dispatch('staff/updatePlaceAvailability');

      if(isOwner.value) {
        await store.dispatch('owner/getStaffInfo');
      }

      event.target.complete();
    };

    /* Methods */


    return {
      /* Component properties */
      tables,
      activeStaff,
      availabilityRatio,
      isOwner,

      /* Event handlers */
      toggle,
      refresh,
    };
  },

});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
  background: var(--show-paint);
}
</style>