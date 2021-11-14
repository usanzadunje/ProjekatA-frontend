<template>
  <div>
    <ion-card
        class="mb-6 mt-0 mx-auto w-5/6"
        :button="button"
        @click="$emit('editStaff')"
    >
      <slot></slot>
      <ion-card-header>
        <div class="flex items-center justify-center">
          <AppAvatar
              :avatar-path="staff?.avatar"
              :avatar-img-classes="'profile-avatar'"
          />

          <div class="ml-8 flex-shrink">
            <h3 class="main-heading-smaller">{{ staff?.active ? $t('active') : $t('inactive') }}</h3>
            <h2 class="secondary-heading break-all">{{ displayName }}</h2>
          </div>
        </div>
      </ion-card-header>
    </ion-card>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import {
  IonCard,
  IonCardHeader,
}                                    from '@ionic/vue';

import AppAvatar from '@/components/AppAvatar';

export default defineComponent({
  name: "StaffCard",
  components: {
    IonCard,
    IonCardHeader,
    AppAvatar,
  },
  props: {
    staff: {
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
  emits: ['editStaff'],
  setup(props) {
    /* Component properties */
    const displayName = computed(() => {
      return !props.staff?.fname && !props.staff?.lname
          ? props.staff?.username ?? ''
          : `${props.staff?.fname ?? ''} ${props.staff?.lname ?? ''}`;
    });

    /* Event handlers */

    return {
      /* Component properties */
      displayName,

      /* Event handlers */

      /* Icons */
    };
  },
});
</script>

<style scoped>
ion-card {
  --background: var(--primary-button);
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