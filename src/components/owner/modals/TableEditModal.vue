<template>
  <div class="px-10 pt-6 pb-4 staff-modal-bg">
    <h2 class="secondary-heading text-center">
      {{ `${$t('update')} ${$t('or')} ${$t('remove').toLowerCase()}` }}
    </h2>
    <div class="mt-4">
      <div
          class="flex flex-col items-center py-2 item-bg rounded-2xl"
          :class="{ 'error-border' : errorNames.hasOwnProperty('smoking_allowed') }"
      >
        <ion-label class="settings-fade-text">
          {{ `${$t('smoking')}?` }}
        </ion-label>
        <div class="flex mt-2">
          <div
              class="flex justify-center items-center h-6 px-1 rounded-md"
              :class="table.smoking_allowed ? 'bg-green-500 text-color-selected' : 'text-color'"
              @click="table.smoking_allowed = !table.smoking_allowed"
          >
            <span>{{ $t('allowed') }}</span>
          </div>
          <div
              class="flex justify-center items-center h-6 px-1 rounded-md ml-2"
              :class="!table.smoking_allowed ? 'bg-red-500 text-color-selected' : 'text-color'"
              @click="table.smoking_allowed = !table.smoking_allowed"
          >
            <span>{{ $t('forbidden') }}</span>
          </div>
        </div>
      </div>
      <ion-item
          lines="none"
          class="rounded-2xl h-11 mt-3.5"
          :class="{ 'error-border' : errorNames.hasOwnProperty('price') }"
      >
        <ion-icon
            slot="start"
            :icon="accessibilityOutline"
            class="mr-2 text-xl text-gray-500"
        >
        </ion-icon>

        <ion-input
            v-model.number="table.seats"
            type="number"
            :placeholder="$t('numberOfSeats')"
            required
            @keyup.enter="updateTable(tableProp.id)"
        ></ion-input>
      </ion-item>
    </div>
    <div class="mt-12">
      <ion-button
          :disabled="loading >= 0"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white relative"
          @click="updateTable(tableProp.id)"
      >
        {{ loading === 0 ? $t('checking') : $t('update') }}
        <ion-spinner v-if="loading === 0" name="crescent" class="absolute right-0"></ion-spinner>
      </ion-button>
      <ion-button
          :disabled="loading >= 0"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase text-white relative btn-bg-danger mt-4 font-bold"
          @click="deleteTable(tableProp.id)"
      >
        {{ loading === 1 ? $t('removing') : $t('remove') }}
        <ion-spinner v-if="loading === 1" name="crescent" class="absolute right-0"></ion-spinner>
      </ion-button>
    </div>

  </div>
</template>

<script>
import { defineComponent, ref, toRefs } from 'vue';
import { useStore }                     from 'vuex';
import { useI18n }                      from 'vue-i18n';
import {
  IonLabel,
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonSpinner,
  alertController,
}                                       from '@ionic/vue';

import { useErrorHandling } from '@/composables/useErrorHandling';

import {
  accessibilityOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'TableEditModal',
  components: {
    IonLabel,
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    IonSpinner,
  },
  props: {
    tableProp: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const table = ref({});
    const { tableProp } = toRefs(props);
    const loading = ref(-1);

    /* Composables */
    const { t } = useI18n();
    const { errorNames, tryCatch } = useErrorHandling();

    /* Lifecycle hooks */
    table.value.smoking_allowed = tableProp.value.smoking_allowed ?? false;
    table.value.seats = tableProp.value.seats;

    /* Event handlers */
    const updateTable = async(id) => {
      loading.value = 0;

      await tryCatch(
          async() => {
            await store.dispatch("owner/updateTable", { tableId: id, payload: table.value });
          },
          {
            successMessageKey: 'owner.updateTable',
          },
      );

      loading.value = -1;

    };
    const deleteTable = async(id) => {
      loading.value = 1;

      const alert = await alertController
          .create({
            header: t('owner.alertRemoveTableHeader'),
            message: t('owner.removeTableMessage'),
            buttons: [
              {
                text: t('disagree'),
                role: 'cancel',
                handler: () => {
                  loading.value = -1;
                },
              },
              {
                text: t('agree'),
                handler: async() => {
                  await tryCatch(
                      async() => {
                        await store.dispatch("owner/deleteTable", id);
                      },
                      {
                        successMessageKey: 'owner.removeTable',
                        errorMessageKey: 'generalAlertError',
                      },
                  );

                  emit('dismiss');
                  loading.value = -1;
                },
              },
            ],
          });

      await alert.present();
    };
    const dismiss = () => {
      emit('dismiss');
    };

    return {
      /* Component properties */
      table,
      loading,
      errorNames,

      /* Event handlers */
      updateTable,
      deleteTable,
      dismiss,

      /* Icons */
      accessibilityOutline,
    };
  },
});
</script>

<style scoped>
ion-button {
  font-size: 0.875rem !important;
}

span {
  font-size: 1rem !important;
}

.text-color-selected {
  color: var(--secondary-paint);
  font-weight: 500;
}

.text-color {
  color: var(--search-color);
  font-weight: 400;

}
</style>