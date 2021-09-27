<template>
  <div>
    <ion-card
        class="mb-6 mt-0 mx-auto w-5/6"
        :button="button"
        @click="$emit('editMember')"
    >
      <slot></slot>
      <ion-card-header>
        <div class="flex items-center justify-center">
          <ion-thumbnail
              class="user-profile-picture-edit"
          >
            <img
                class="user-profile-picture-edit"
                alt="avatar"
                :src="member.avatar"
            >
          </ion-thumbnail>
          <div class="ml-8">
            <h3 class="main-heading-smaller">{{ member.active ? $t('active') : $t('inactive') }}</h3>
            <h2 class="secondary-heading">{{ `${member.lname} ${member.fname}` }}</h2>
          </div>
        </div>
      </ion-card-header>
    </ion-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonCard,
  IonCardHeader,
  IonThumbnail,
}                          from '@ionic/vue';

export default defineComponent({
  name: "StaffCard",
  components: {
    IonCard,
    IonCardHeader,
    IonThumbnail,
  },
  props: {
    member: {
      type: Object,
      default: null,
      required: true,
    },
    button: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  emits: ['editMember'],
  setup() {
    /* Component properties */

    /* Event handlers */

    return {
      /* Event handlers */

      /* Icons */
    };
  },
});
</script>

<style scoped>
ion-card {
  box-shadow: #000 0 1px 4px;
  --background: var(--staff-card-background);
  border-radius: 20px !important;
}

ion-card-subtitle {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  color: var(--primary-text);
  font-size: 12px;
}

h2 {
  color: #F0F0F2 !important;
}

h3 {
  color: #F0F0F2 !important;
  letter-spacing: 0 !important;
}
</style>