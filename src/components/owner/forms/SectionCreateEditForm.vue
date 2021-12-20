<template>
  <div class="">
    <ion-item
        lines="none"
        class="rounded-2xl h-11"
        :class="{ 'error-border' : errorNames.hasOwnProperty('name') }"
    >
      <ion-icon
          slot="start"
          :icon="pricetagOutline"
          class="mr-2 text-xl text-gray-500"
      ></ion-icon>
      <ion-input
          v-model.lazy="internalSection.name"
          v-capitalize
          type="text"
          :placeholder="$t('name')"
          :autofocus="true"
          required
          @keyup.enter="createOrUpdateSection"
      ></ion-input>
    </ion-item>

    <div class="mt-4">
      <ion-button
          :disabled="loading"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white relative"
          @click="createOrUpdateSection"
      >
        {{ loading ? $t('checking') : (!section ? $t('create') : $t('update')) }}
        <ion-spinner v-if="loading" name="crescent" class="absolute right-0"></ion-spinner>
      </ion-button>
      <ion-button
          :disabled="loading"
          fill="clear"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-black mt-4"
          @click="$emit('dismiss')"
      >
        {{ $t('cancel') }}
      </ion-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useStore }                                          from 'vuex';
import {
  IonItem,
  IonIcon,
  IonInput,
  IonButton,
  IonSpinner,
}                                                            from '@ionic/vue';

import { useErrorHandling }   from '@/composables/useErrorHandling';
import { hideNativeKeyboard } from '@/composables/useDevice';

import {
  pricetagOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: "SectionCreateEditForm",
  components: {
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
    IonSpinner,
  },
  props: {
    section: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    /* Global properties */
    const store = useStore();

    /* Component properties */

    /* Composables */
    const { errorNames, tryCatch } = useErrorHandling();

    /* Component properties */
    const { section } = toRefs(props);
    const internalSection = reactive({});
    const loading = ref(false);

    /* Composables */
    /* Lifecycle hooks */
    onMounted(async() => {
      if(section?.value) {
        internalSection.name = section.value.name;
      }
    });

    /* Methods */

    /* Event handlers */
    const createOrUpdateSection = async() => {
      loading.value = true;
      await hideNativeKeyboard();

      await tryCatch(
          async() => {
            if(section?.value) {
              await store.dispatch("owner/updateTableSection", {
                sectionId: section.value.id,
                payload: internalSection,
              });
            }else {
              await store.dispatch("owner/createTableSection", internalSection);
            }

            emit('dismiss');
          },
          {
            successMessageKey: section?.value ? 'owner.updateSection' : 'owner.createSection',
          },
      );

      loading.value = false;
    };
    /* Watchers */


    return {
      /* Global properties */

      /* Component properties */
      internalSection,
      errorNames,
      loading,

      /* Event handlers  */
      createOrUpdateSection,

      /* Icons */
      pricetagOutline,
    };
  },
});
</script>
<style scoped>
</style>