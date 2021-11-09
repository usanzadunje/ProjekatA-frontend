<template>
  <ion-page>
    <ion-content scrollY="false">
      <TheOwnerSegmentNavigation/>

      <div class="h-full flex flex-col justify-between">
        <div>
          <div class="flex flex-col items-center">
            <div class="secondary-heading text-center">{{ $t('addTableText') }}</div>
            <Table class="mt-2"/>
          </div>

          <div class="px-4">
            <TableContainer class="mt-10">
              <Table
                  v-for="table in tables"
                  :key="table.id"
                  :draggable="true"
                  :data-id="table.id"
                  :style="
                        `position: absolute;
                        top: 0; left: 0;
                        transform:translate(${table.position?.left}px, ${table.position.top}px)
                        `
                      "
                  @click="showTableModal(table)"
              />
            </TableContainer>
          </div>
        </div>

        <div class="flex flex-col items-center">
          <ion-button
              expand="block"
              class="auth-button-size auth-button-border-radius uppercase button-text-white mt-8 mb-3 mx-auto w-5/6"
              @click="updateTables"
              :disabled="loading >= 0"
          >
            {{ loading === 0 ? `${$t('updating')}...` : $t('update') }}
          </ion-button>
          <ion-button
              expand="block"
              fill="clear"
              class="auth-button-size auth-button-border-radius uppercase button-text-black mb-4 mx-auto w-5/6"
              @click="resetTables"
              :disabled="loading >= 0"
          >
            {{ loading === 1 ? `${$t('resetting')}...` : $t('reset') }}
          </ion-button>
        </div>
      </div>

      <AppModal
          :is-open="isModalOpen"
          css-class="custom-edit-table-modal"
          :swipe-to-close="false"
          width="90%"
          @didDismiss="openModal(false);"
      >
        <TableEditModal
            :table-prop="modalData"
            @dismiss="openModal(false)"
        />
      </AppModal>
    </ion-content>
  </ion-page>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useStore }                                  from 'vuex';
import {
  IonPage,
  IonContent,
  IonButton,
  onIonViewWillLeave,
  onIonViewDidEnter,
}                                                    from '@ionic/vue';

import TheOwnerSegmentNavigation from '@/components/owner/TheOwnerSegmentNavigation';
import TableContainer            from '@/components/TableContainer';
import Table                     from '@/components/Table';
import AppModal                  from '@/components/AppModal';
import TableEditModal            from '@/components/owner/modals/TableEditModal';


import { useErrorHandling } from '@/composables/useErrorHandling';
import { useModal }         from '@/composables/useModal';

import { removeClonedTableElements } from '@/utils/helpers';

export default defineComponent({
  name: "TableIndex",
  components: {
    IonPage,
    IonContent,
    IonButton,
    TheOwnerSegmentNavigation,
    TableContainer,
    Table,
    AppModal,
    TableEditModal,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const tables = computed(() => store.getters['owner/tables'].filter(table => !table.clone));
    const loading = ref(-1);
    let outlet = null;
    const swiperHandler = ref({});

    /* Composables */
    const { isModalOpen, modalData, openModal } = useModal();
    const { tryCatch } = useErrorHandling();

    /* Lifecycle hooks */
    onMounted(() => {
      outlet = document.getElementById('admin-outlet');

      swiperHandler.value = outlet.swipeHandler;
    });
    onIonViewDidEnter(() => {
      if(outlet) {
        outlet.swipeHandler = null;
      }
    });
    onIonViewWillLeave(() => {
      removeClonedTableElements();
      store.commit('owner/REMOVE_CLONED_TABLES');

      outlet.swipeHandler = swiperHandler.value;
    });

    /* Methods */
    /* Event handlers */
    const updateTables = async() => {
      loading.value = 0;

      await tryCatch(
          async() => {
            await store.dispatch("owner/updateTables");
          },
          'owner.updateTables',
      );

      loading.value = -1;
    };
    const resetTables = async() => {
      loading.value = 1;

      await tryCatch(
          async() => {
            await store.dispatch("owner/getTables");
          },
      );
      loading.value = -1;
    };
    const showTableModal = async(table) => {
      openModal(true, table);
    };

    return {
      /* Component properties */
      tables,
      loading,
      isModalOpen,
      modalData,

      /* Event handlers */
      updateTables,
      resetTables,
      showTableModal,
      openModal,

    };
  },

});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
}
</style>