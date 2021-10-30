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
        <div
            v-if="this.$store.getters['auth/isStaff']"
            class="w-56 -mt-4 mb-4 mx-auto px-4 border-b border-l border-r border-primary rounded-bl-3xl rounded-br-3xl"
        >
          <p class="text-center secondary-heading">You status</p>
          <StaffActivityToggle
              :class="this.$store.getters['staff/active'] ? 'active-status-text-color' : ''"
              :icon-classes="`pb-1 text-2xl ml-1 mr-1`"
              :text-classes="`pb-1 text-xl`"
          />
        </div>

        <h1 class="text-center uppercase secondary-heading">{{ $t('owner.currentAvailabilitySituation') }}</h1>

        <div class="mt-4">
          <TableContainer
              v-show="!showSkeleton"
              class="mt-2"
          >
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
          <ion-skeleton-text
              v-show="showSkeleton"
              animated="true"
              class="tableSkeleton rounded-md"
          ></ion-skeleton-text>
        </div>
        <div
            :class="`
          flex ${ isOwner ? 'flex-col-reverse' : 'flex-col' } md:flex-row
          justify-start md:justify-around
          `"
        >
          <div
              v-if="isOwner"
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

          <PlaceAvailabilityChart v-show="!showSkeleton"/>
          <div class="flex justify-start items-center mt-8">
            <ion-skeleton-text
                v-show="showSkeleton"
                animated="true"
                class="chartSkeleton rounded-full flex-shrink-0"
            ></ion-skeleton-text>
            <div class="ml-2">
              <ion-skeleton-text
                  v-show="showSkeleton"
                  animated="true"
                  class="w-20 h-4"
              ></ion-skeleton-text>
              <ion-skeleton-text
                  v-show="showSkeleton"
                  animated="true"
                  class="w-20 h-4"
              ></ion-skeleton-text>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useStore }                                  from 'vuex';
import {
  IonPage,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  onIonViewWillEnter,
}                                                    from '@ionic/vue';

import StaffActivityToggle            from '@/components/staff/StaffActivityToggle';
import TableContainer                 from '@/components/TableContainer';
import Table                          from '@/components/Table';
import StaffCard                      from '@/components/staff/cards/StaffCard';
import PlaceAvailabilityChart         from '@/components/staff/charts/PlaceAvailabilityChart';
import StaffAvailabilityToggleButtons from '@/components/staff/StaffAvailabilityToggleButtons';

import { usePlaceManipulation } from '@/composables/usePlaceManipulation';
import { useErrorHandling }     from '@/composables/useErrorHandling';

import { Capacitor } from '@capacitor/core';

export default defineComponent({
  name: "StaffDashboard",
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    StaffActivityToggle,
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
    const availabilityRatio = computed(() => store.getters['staff/availabilityRatio']);
    const tables = computed(() => store.getters['owner/tables']);
    const activeStaff = computed(() => store.getters['owner/activeStaff']);
    const isOwner = computed(() => store.getters['auth/isOwner']);
    const showSkeleton = ref(true);

    /* Composables */
    const { toggle } = usePlaceManipulation();
    const { tryCatch } = useErrorHandling();

    /* Methods */
    const getPlaceAvailability = async() => {
      showSkeleton.value = true;

      await tryCatch(
          async() => {
            await store.dispatch('staff/updatePlaceAvailability');
          },
          null,
          'dataFetchingError',
      );

      showSkeleton.value = false;
    };
    /* Lifecycle hooks */
    onMounted(async() => {
      await getPlaceAvailability();
    });
    onIonViewWillEnter(async() => {
      if(!Capacitor.isNativePlatform()) {
        await getPlaceAvailability();
      }
    });


    /* Event handlers */
    const refresh = async(event) => {
      showSkeleton.value = true;

      await tryCatch(
          async() => {
            await store.dispatch('owner/getTables');
            await store.dispatch('staff/updatePlaceAvailability');

            if(isOwner.value) {
              await store.dispatch('owner/getActiveStaffInfo');
            }
          },
          null,
          'dataFetchingError',
      );

      showSkeleton.value = false;

      event.target.complete();
    };

    /* Methods */


    return {
      /* Component properties */
      availabilityRatio,
      tables,
      activeStaff,
      isOwner,
      showSkeleton,

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

.tableSkeleton {
  height: 174px;
}

.chartSkeleton {
  width: 70vw;
  height: 70vw;
}
</style>