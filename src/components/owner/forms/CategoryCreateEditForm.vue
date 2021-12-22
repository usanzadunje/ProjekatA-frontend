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
          v-model.lazy="internalCategory.name"
          v-capitalize
          type="text"
          :placeholder="$t('category')"
          :autofocus="true"
          required
          @keyup.enter="createOrUpdateCategory"
      ></ion-input>
    </ion-item>
    <ion-item
        button
        detail="false"
        lines="none"
        class="rounded-2xl h-11 mt-3.5"
        :class="{ 'error-border' : errorNames.hasOwnProperty('icon') }"
        @click="openIconChoicePopover"
    >
      <span
          slot="start"
          class="placeholder-text-color"
      >
        {{ $t('chooseIcon') }}
      </span>

      <ion-icon
          slot="end"
          :icon="categoryIcons[internalCategory.icon] ?? categoryIcons['fastFoodOutline']"
          class="mr-2 text-xl text-gray-500"
      ></ion-icon>
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
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { useStore }                                          from 'vuex';
import {
  IonItem,
  IonIcon,
  IonInput,
  IonButton,
  IonSpinner,
}                                                            from '@ionic/vue';

import IconChoicePopover from '@/components/owner/popovers/IconChoicePopover';

import { useErrorHandling }   from '@/composables/useErrorHandling';
import { hideNativeKeyboard } from '@/composables/useDevice';
import { usePopover }         from '@/composables/usePopover';
import { useIcons }           from '@/composables/useIcons';

import {
  pricetagOutline,
} from 'ionicons/icons';

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
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const { category } = toRefs(props);
    const internalCategory = reactive({
      name: null,
      icon: 'fastFoodOutline',
    });
    const loading = ref(false);
    const prevSelectedIcon = ref(category.value?.icon);

    /* Composables */
    const { errorNames, tryCatch } = useErrorHandling();
    const { categoryIcons } = useIcons();
    const { openPopover } = usePopover();

    /* Lifecycle hooks */
    onMounted(async() => {
      if(category?.value) {
        internalCategory.name = category.value.name;
        internalCategory.icon = category.value.icon;
      }
    });

    /* Methods */

    /* Event handlers */
    const createOrUpdateCategory = async() => {
      loading.value = true;
      await hideNativeKeyboard();

      await tryCatch(
          async() => {
            if(category?.value) {
              await store.dispatch("owner/updateCategory", {
                id: category.value.id,
                category: internalCategory,
              });
            }else {
              await store.dispatch("owner/createCategory", internalCategory);
            }

            emit('dismiss');
          },
          {
            successMessageKey: category?.value ? 'owner.updateCategory' : 'owner.createCategory',
          },
      );

      loading.value = false;
    };
    const openIconChoicePopover = async() => {
      const popover = await openPopover(IconChoicePopover, null, 'icon-choice-popover', {
        icons: categoryIcons,
      });

      const { data } = await popover.onDidDismiss();

      internalCategory.icon = data?.icon ?? prevSelectedIcon.value;

      prevSelectedIcon.value = data?.icon ?? prevSelectedIcon.value;
    };

    /* Watchers */


    return {
      /* Global properties */

      /* Component properties */
      internalCategory,
      errorNames,
      loading,

      /* Event handlers  */
      createOrUpdateCategory,
      openIconChoicePopover,

      /* Icons */
      categoryIcons,
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

span {
  font-size: 0.8rem !important;
}
</style>