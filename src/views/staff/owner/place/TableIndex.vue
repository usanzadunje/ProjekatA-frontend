<template>
  <ion-page>
    <ion-content scrollY="false">
      <div class="h-full flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-center">
            <Table/>
            <span class="ml-2 secondary-heading">-pick a table and drag</span>
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
import { computed, defineComponent, ref } from 'vue';
import { useStore }                       from 'vuex';
import { useI18n }                        from 'vue-i18n';
import {
  IonPage,
  IonContent,
  IonButton,
  onIonViewWillLeave,
}                                         from '@ionic/vue';

import TableContainer from '@/components/TableContainer';
import Table          from '@/components/Table';
import AppModal       from '@/components/AppModal';
import TableEditModal from '@/components/owner/modals/TableEditModal';

import { useToastNotifications } from '@/composables/useToastNotifications';

import { removeClonedTableElements } from '@/utils/helpers';
import { useModal }                  from '@/composables/useModal';

export default defineComponent({
  name: "TableIndex",
  components: {
    IonPage,
    IonContent,
    IonButton,
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

    /* Composables */
    const { t } = useI18n();
    const { showSuccessToast, showErrorToast } = useToastNotifications();
    const { isModalOpen, modalData, openModal } = useModal();

    /* Lifecycle hooks */
    onIonViewWillLeave(() => {
      removeClonedTableElements();
      store.commit('owner/REMOVE_CLONED_TABLES');
    });

    /* Methods */
    /* Event handlers */
    const updateTables = async() => {
      loading.value = 0;
      try {
        await store.dispatch("owner/updateTables");

        showSuccessToast(t('owner.updateTables'));
      }catch(errors) {
        await showErrorToast(errors);
      }finally {
        loading.value = -1;
      }
    };
    const resetTables = async() => {
      loading.value = 1;
      try {
        await store.dispatch("owner/getTables");
      }catch(errors) {
        await showErrorToast(errors);
      }finally {
        loading.value = -1;
      }
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