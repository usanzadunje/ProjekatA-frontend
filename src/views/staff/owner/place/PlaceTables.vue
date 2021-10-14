<template>
  <ion-page v-disable-swipe-back>
    <ion-content>
      <div class="h-full flex flex-col justify-between">
        <div>
          <h1 class="secondary-heading text-center">Pick a table and drag</h1>

          <div class="flex items-center justify-center mt-5 ml-5">
            <Table/>
            <span class="ml-2 secondary-heading">-drop me where you want</span>
          </div>


          <div class="px-4">
            <TableContainer class="mt-16">
              <Table
                  v-for="table in tables"
                  :key="table.id"
                  :draggable="true"
                  :data-id="table.id"
                  :data-force-position="true"
                  :style="
                  `position: absolute;
                  top: 0; left: 0;
                  transform:translate(${table.position.left}px, ${table.position.top}px)
                  `
                "
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
}                                         from '@ionic/vue';

import TableContainer from '@/components/TableContainer';
import Table          from '@/components/Table';

import { useToastNotifications } from '@/composables/useToastNotifications';

export default defineComponent({
  name: "PlaceTables",
  components: {
    IonPage,
    IonContent,
    IonButton,
    TableContainer,
    Table,
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

    /* Lifecycle hooks */
    (async() => {
      await store.dispatch('owner/getTables');
    })();

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

    return {
      /* Component properties */
      tables,
      loading,

      /* Event handlers */
      updateTables,
      resetTables,
    };
  },

});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
}
</style>