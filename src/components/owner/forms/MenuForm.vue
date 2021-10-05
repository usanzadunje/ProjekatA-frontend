<template>
  <div class="px-4">
    <div v-show="!hideCreateCategory">
      <h1 class="secondary-heading text-center">{{ $t('createCategory') }}</h1>

      <CreateCategoryForm class="mt-4"/>

      <RemoveCategoryForm class="mt-4"/>

      <hr class="mt-4">
    </div>

    <div class="flex items-center justify-center">
      <ion-label
          class="settings-fade-text"
      >
        {{ hideCreateCategory ? $t('showCreateCategory') : $t('hideCreateCategory') }}
      </ion-label>
      <ion-toggle
          :checked="hideCreateCategory"
          @ionChange="hideCreateCategory = !hideCreateCategory"
          mode="md"
      ></ion-toggle>
    </div>

    <hr>

    <div class="mt-4">
      <h1 class="secondary-heading text-center">{{ $t('createMenuItem') }}</h1>

      <CreateMenuItemForm class="mt-4"/>
    </div>


  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import {
  IonToggle,
  IonLabel,
}                               from '@ionic/vue';

import CreateCategoryForm from '@/components/owner/forms/CreateCategoryForm';
import RemoveCategoryForm from '@/components/owner/forms/RemoveCategoryForm';
import CreateMenuItemForm from '@/components/owner/forms/CreateMenuItemForm';


import {} from 'ionicons/icons';


export default defineComponent({
  name: "MenuForm",
  components: {
    IonToggle,
    IonLabel,
    CreateCategoryForm,
    RemoveCategoryForm,
    CreateMenuItemForm,
  },
  props: {},
  setup() {
    /* Global properties and methods */

    /* Computed properties */
    const hideCreateCategory = ref(false);

    /* Component properties */

    /* Lifecycle hooks */


    /* Composables */


    /* Methods */

    /* Event handlers */

    /* Watchers */


    return {
      /* Global properties */

      /* Component properties */
      hideCreateCategory,

      /* Event handlers  */

      /* Icons */
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