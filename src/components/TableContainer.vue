<template>
  <div class="p-0.5 border-2 rounded-md border-primary">
    <div id="dropzone" class="relative dropzone-height">
      <slot></slot>
      <div
          v-if="this.$store.getters['owner/tables'].length <= 0 && !isEndUser"
          class="flex justify-start"
      >
        <AddTablesPlaceholderImage
            :height="'170px'"
            :width="'60%'"
            class="-ml-8"
        />
        <div
            class="absolute top-1/2 transform -translate-y-1/2 left-2/3 -translate-x-1/2 w-4/6"
        >
          <div
              v-if="isOwner"
              class="flex flex-col items-center"
          >
            <p class="text-center placeholder-heading-extra-small primary-text-color">
              {{ $t('noTablesHeading1') }}
            </p>
            <p class="text-center placeholder-heading-2extra-small primary-text-color">
              {{
                this.$route.name === 'staff.dashboard' ?
                    $t('owner.dashboard.noTablesHeading2') :
                    $t('owner.tables.noTablesHeading2')
              }}
            </p>
            <ion-button
                v-if="this.$route.name === 'staff.dashboard'"
                size="small"
                class="user-selected-button-background mt-2"
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
              {{ $t('noTablesHeading1') }}
            </p>
            <p class="text-center placeholder-heading-2extra-small primary-text-color">
              {{ $t('staff.noTablesHeading2') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import { IonButton }       from '@ionic/vue';

import AddTablesPlaceholderImage from '@/components/images/AddTablesPlaceholderImage';

import { useCurrentUser } from '@/composables/useCurrentUser';

export default defineComponent({
  name: "TableContainer",
  components: {
    IonButton,
    AddTablesPlaceholderImage,
  },
  setup() {
    /* Global properties */

    /* Component properties */

    /* Composables */
    const { isOwner, isStaff, isEndUser } = useCurrentUser();
    /* Lifecycle hooks */

    /* Event handlers */

    return {
      /* Component properties */
      isOwner,
      isStaff,
      isEndUser,

      /* Event handlers */
    };
  },

});
</script>
<style scoped>
.dropzone-height {
  height: 170px;
}
</style>