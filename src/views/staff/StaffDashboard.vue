<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-refresher pull-min="100" slot="fixed" @ionRefresh="refresh($event)" class="transparent">
        <ion-refresher-content
            refreshing-spinner="crescent"
        >
        </ion-refresher-content>
      </ion-refresher>
      <div class="wrap safe-mb">
        <TheHangingHeader
            v-if="this.$store.getters['auth/isStaff']"
            class="px-4 mb-4"
        >
          <p class="text-center secondary-heading">{{ $t('workingActivity') }}</p>
          <StaffActivityToggle
              class="justify-center"
              :class="this.$store.getters['staff/active'] ? 'active-status-text-color' : ''"
              :icon-classes="`pb-1 text-2xl ml-1 mr-1`"
              :text-classes="`pb-1 text-xl`"
          />
        </TheHangingHeader>

        <TheHangingHeader
            v-if="this.$store.getters['auth/isOwner']"
            class="p-2"
        >
          <h1 class="text-center secondary-heading">{{ $t('owner.currentAvailabilitySituation') }}</h1>
        </TheHangingHeader>

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
          <TableSectionPicker
              v-if="this.$store.getters['owner/tables'].length > 0"
              v-show="!showSkeleton"
              :table-sections="tableSections"
              :active-section="activeSection"
              :active-css-classes="'staff-section-active'"
              :inactive-css-classes="'staff-section-inactive'"
              class="mt-4"
              @section-changed="changeSection"
          />
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
            <div v-if="activeStaff.length > 0">
              <h1 class="text-center uppercase secondary-heading">{{ $t('owner.currentActiveStaff') }}</h1>

              <StaffCard
                  v-for="staff in activeStaff"
                  :key="staff.id"
                  :staff="staff"
                  :button="false"
                  class="mt-4"
              />
            </div>
            <div
                v-else
                class="flex flex-col items-center justify-center px-6"
            >
              <img
                  :src="`${backendStorageURL}/screens/sleeping_placeholder.svg`"
                  alt="Placeholder image of creature sleeping"
                  class="w-3/5"
              >
              <div class="flex flex-col items-center mt-2">
                <p class="text-center placeholder-heading-big primary-text-color">
                  {{ $t('noActiveStaffHeading1') }}
                </p>
                <p class="text-center placeholder-heading-small primary-text-color break-words">
                  {{ $t('noActiveStaffHeading2') }}
                </p>
              </div>
            </div>
          </div>


          <div
              v-if="this.$store.getters['owner/tables'].length > 0"
              :class="`
              flex ${ isOwner ? 'flex-col-reverse' : 'flex-col' } md:flex-row
              justify-start md:justify-around
              `"
          >
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
          <div
              v-else
              class="flex items-center w-full mt-8"
          >
            <img
                :src="`${backendStorageURL}/screens/no_tables_chart_placeholder.svg`"
                alt="Placeholder image of person looking at chart"
                class="w-3/5 -ml-8"
            >
            <div
            >
              <div
                  v-if="isOwner"
                  class="flex flex-col items-center"
              >
                <p class="text-center placeholder-heading-extra-small primary-text-color">
                  {{ $t('noTablesChartHeading1') }}
                </p>
                <p class="text-center placeholder-heading-2extra-small primary-text-color">
                  {{ $t('owner.noTablesChartHeading2') }}
                </p>
                <ion-button
                    size="small"
                    class="blue-button-background mt-2"
                    @click="this.$router.push({ name: 'owner.place.tables' })"
                >
                  {{ $t('add') }}
                </ion-button>
              </div>
              <div
                  v-if="isStaff"
                  class="flex flex-col items-center"
              >
                <p class="text-center placeholder-heading-extra-small primary-text-color">
                  {{ $t('noTablesChartHeading1') }}
                </p>
                <p class="text-center placeholder-heading-2extra-small primary-text-color">
                  {{ $t('staff.noTablesChartHeading2') }}
                </p>
              </div>
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
  IonButton,
  onIonViewWillEnter,
}                                                    from '@ionic/vue';

import StaffActivityToggle            from '@/components/staff/StaffActivityToggle';
import TableContainer                 from '@/components/TableContainer';
import Table                          from '@/components/Table';
import TableSectionPicker             from '@/components/TableSectionPicker';
import StaffCard                      from '@/components/staff/cards/StaffCard';
import PlaceAvailabilityChart         from '@/components/staff/charts/PlaceAvailabilityChart';
import StaffAvailabilityToggleButtons from '@/components/staff/StaffAvailabilityToggleButtons';
import TheHangingHeader               from '@/components/TheHangingHeader';

import { usePlaceManipulation } from '@/composables/usePlaceManipulation';
import { useErrorHandling }     from '@/composables/useErrorHandling';
import { useTableSections }     from '@/composables/useTableSections';
import { useCurrentUser }       from '@/composables/useCurrentUser';

import { Capacitor } from '@capacitor/core';

export default defineComponent({
  name: "StaffDashboard",
  components: {
    IonPage,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonSkeletonText,
    IonButton,
    TheHangingHeader,
    StaffActivityToggle,
    TableContainer,
    Table,
    TableSectionPicker,
    StaffCard,
    StaffAvailabilityToggleButtons,
    PlaceAvailabilityChart,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const availabilityRatio = computed(() => store.getters['staff/availabilityRatio']);
    const tables = computed(() => {
      return store.getters['owner/tables'].filter(table => table.section.id === activeSection.value);
    });
    const tableSections = computed(() => store.getters['owner/tableSections']);
    const activeStaff = computed(() => store.getters['owner/activeStaff']);
    const showSkeleton = ref(true);

    /* Composables */
    const { toggle } = usePlaceManipulation();
    const { tryCatch } = useErrorHandling();
    const { activeSection, changeSection } = useTableSections();
    const { isOwner, isStaff } = useCurrentUser();

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
      tableSections,
      activeStaff,
      isOwner,
      isStaff,
      showSkeleton,
      activeSection,

      /* Event handlers */
      toggle,
      refresh,
      changeSection,
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