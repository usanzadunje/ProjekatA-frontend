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

          <div class="px-4 mt-16">
            <div class="p-0.5 border-2 border-black">
              <div id="dropzone" class="relative h-44">
                <Table
                    v-for="table in tables"
                    :key="table.id"
                    :data-id="table.id"
                    :data-force-position="true"
                    :style="
                    `position: absolute;
                    top: 0; left: 0;
                    transform:translate(${table.position.left}px, ${table.position.top}px)
                    `"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center">
          <ion-button
              expand="block"
              class="auth-button-size auth-button-border-radius uppercase button-text-white my-8 mx-auto w-5/6"
              @click="updateTables"
              :disabled="loading"
          >
            {{ loading ? `${$t('updating')}...` : $t('update') }}
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

import Table                     from '@/components/staff/Table';
import { useToastNotifications } from '@/composables/useToastNotifications';

export default defineComponent({
  name: "PlaceTables",
  components: {
    IonPage,
    IonContent,
    IonButton,
    Table,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const tables = computed(() => {
      return store.getters['owner/tables'].filter(table => !table.clone);
    });
    const loading = ref(false);

    /* Composables */
    const { t } = useI18n();
    const { showSuccessToast, showErrorToast } = useToastNotifications();

    /* Lifecycle hooks */
    (async() => {
      await store.dispatch('owner/getTables');
    })();

    /* Event handlers */
    const updateTables = async() => {
      loading.value = true;
      try {
        await store.dispatch("owner/updateTables");

        // Since vuex is getting populated with tables that are stored in DB
        // these cloned ones will still stay and be duplicated with ones returned
        // to avoid this we remove cloned tables and keep only fresh ones from real DB
        document.querySelectorAll('[data-cloned="true"]').forEach(clonedTable => {
          document.querySelector("#dropzone").removeChild(clonedTable);
        });

        showSuccessToast(t('owner.updateTables'));
      }catch(errors) {
        await showErrorToast(errors);
      }finally {
        loading.value = false;
      }
    };

    return {
      /* Component properties */
      tables,
      loading,

      /* Event handlers */
      updateTables,
    };
  },

});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
}
</style>