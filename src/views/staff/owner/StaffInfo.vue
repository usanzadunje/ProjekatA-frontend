<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="staff-container">
        <h1 class="secondary-heading text-center uppercase">{{ $t('owner.staff') }}</h1>

        <h1 class="secondary-heading text-center uppercase">//opcija da doda novog zaposlenog</h1>

        <div
            v-for="member in staff"
            :key="member.username"
            class="mt-4 relative"
        >
          <div class="absolute top-1 right-9 z-40">
            <div id="editSection" class="flex items-center justify-center mx-auto w-16">
              <ion-icon :icon="create" class="text-2xl text-blue" slot="icon-only"
                        @click="editMember(member, $event)"></ion-icon>
              <ion-icon :icon="removeCircle" class="text-2xl text-danger ml-2" slot="icon-only"
                        @click="removeMember(member, $event)"></ion-icon>
            </div>
          </div>
          <ion-card
              class="mb-6 mt-0 mx-auto w-5/6"
              button="true"
              @click="editMember(member)"
          >
            <ion-card-header>
              <div class="flex items-center justify-around">
                <ion-thumbnail
                    class="user-profile-picture-edit"
                >
                  <img
                      class="user-profile-picture-edit"
                      alt="avatar"
                      :src="member.avatar"
                  >
                </ion-thumbnail>
                <div class="ml-2">
                  <h3 class="main-heading-smaller">{{ $t('staff') }}</h3>
                  <h2 class="secondary-heading">{{ `${member.lname} ${member.fname}` }}</h2>
                </div>
              </div>
            </ion-card-header>
          </ion-card>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useStore }                  from 'vuex';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonThumbnail,
  IonIcon,
}                                    from '@ionic/vue';

import {
  removeCircle,
  create,
} from 'ionicons/icons';

export default defineComponent({
  name: "StaffInfo",
  components: {
    IonPage,
    IonContent,
    IonCard,
    IonCardHeader,
    IonThumbnail,
    IonIcon,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const staff = computed(() => store.getters['owner/staff']);

    /* Composables */

    /* Lifecycle hooks */

    /* Event handlers */
    const editMember = (member, event = null) => {
      event?.stopPropagation();

      console.log(member);
    };
    const removeMember = (member, event = null) => {
      event?.stopPropagation();

      console.log('del', member);
    };

    return {
      /* Component properties */
      staff,

      /* Event handlers */
      editMember,
      removeMember,

      /* Icons */
      removeCircle,
      create,
    };
  },

});
</script>
<style scoped>
ion-content {
  --background: var(--show-paint);
}

ion-card {
  box-shadow: #000 0 2px 4px;
  --background: var(--staff-card-background);
}

ion-card-subtitle {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  color: var(--primary-text);
  font-size: 12px;
}

ion-col {
  --ion-grid-column-padding: 0;
}

h3 {
  letter-spacing: 0 !important;
}

#editSection {
  background: var(--staff-card-background);
}
</style>