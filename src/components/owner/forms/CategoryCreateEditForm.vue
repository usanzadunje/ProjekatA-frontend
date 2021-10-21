<template>
  <div class="">
    <ion-item
        lines="none"
        class="flex rounded-2xl h-11"
        :class="{ 'error-border' : errorNames.hasOwnProperty('category') }"
    >
      <ion-icon :icon="pricetagOutline" class="mr-2 text-xl text-gray-500"></ion-icon>
      <ion-input
          v-model.lazy="categoryName"
          v-capitalize
          type="text"
          :placeholder="$t('category')"
          :autofocus="true"
          required
          @keyup.enter="createOrUpdateCategory"
      ></ion-input>
    </ion-item>

    <div class="mt-4">
      <ion-button
          :disabled="loading"
          size="large"
          expand="block"
          class="auth-button-size auth-button-border-radius uppercase button-text-white relative"
          @click="createOrUpdateCategory"
      >
        {{ loading ? $t('checking') : (!category ? $t('create') : $t('update')) }}
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
import { defineComponent, onMounted, ref, toRefs } from 'vue';
import { useStore }                                from 'vuex';
import { useI18n }                                 from 'vue-i18n';
import {
  IonItem,
  IonIcon,
  IonInput,
  IonButton,
  IonSpinner,
}                                                  from '@ionic/vue';

import { useToastNotifications } from '@/composables/useToastNotifications';

import {
  pricetagOutline,
} from 'ionicons/icons';

import { getError, hideNativeKeyboard, sleep } from '@/utils/helpers';

export default defineComponent({
  name: "CategoryCreateEditForm",
  components: {
    IonItem,
    IonIcon,
    IonInput,
    IonButton,
    IonSpinner,
  },
  props: {
    category: {
      type: Object,
      default: null,
    },
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    /* Global properties and methods */
    const store = useStore();

    /* Composables */
    const { t } = useI18n();
    const { showSuccessToast, showErrorToast } = useToastNotifications();

    /* Component properties */
    const { category } = toRefs(props);
    const categoryName = ref(null);
    const errorNames = ref({});
    const loading = ref(false);

    /* Computed properties */
    /* Lifecycle hooks */
    onMounted(async() => {
      if(category?.value) {
        categoryName.value = category.value.name;
      }
    });

    /* Methods */
    const increaseParentHeight = (additionalHeight) => {
      const accordionPanel = document.getElementById('categoryPanel');
      const panelCurrentMaxHeight = parseInt(getComputedStyle(accordionPanel).getPropertyValue('max-height'));
      accordionPanel.style.setProperty('max-height', `${panelCurrentMaxHeight + additionalHeight}px`);
    };

    /* Event handlers */
    const createOrUpdateCategory = async() => {
      loading.value = true;
      await hideNativeKeyboard();
      try {
        if(category?.value) {
          await store.dispatch("owner/updateCategory", {
            id: category.value.id,
            value: categoryName.value,
          });

          showSuccessToast(t('owner.updateCategory'));
        }else {
          await store.dispatch("owner/createCategory", categoryName.value);

          showSuccessToast(t('owner.createCategory'));

          increaseParentHeight(55);
        }

        emit('dismiss');
      }catch(errors) {
        errorNames.value = getError(errors);
        await showErrorToast(errors);
        await sleep(Object.keys(errorNames.value).length * 900);
        errorNames.value = {};
      }finally {
        loading.value = false;
      }
    };

    /* Watchers */


    return {
      /* Global properties */

      /* Component properties */
      categoryName,
      errorNames,
      loading,

      /* Event handlers  */
      createOrUpdateCategory,

      /* Icons */
      pricetagOutline,
    };
  },
});
</script>
<style scoped>
hr {
  border-top: solid 1px var(--primary-heading) !important;
  width: 100% !important;
}
</style>