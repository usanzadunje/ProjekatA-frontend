<template>
  <ion-page>
    <ion-content>
      <div class="h-full flex flex-col justify-center">
        <article class="text-center">
          <h1
              class="mb-2 text-8xl font-bold text-transparent bg-gradient-to-r bg-clip-text from-blue-500 to-green-500"
          >
            4O4
          </h1>
          <div class="mt-8">
            <p class="font-bold">
              {{ $t('404Lost', { user: (authUser?.fname || authUser?.username) || $t('unknown') }) }}
            </p>
            <p class="font-bold">
              {{ $t('404GetHome') }}
            </p>
          </div>
          <ion-button
              fill="clear"
              class="mx-auto mt-4"
              @click="this.$router.push({ name: isEndUser ? 'home' : 'staff.dashboard'})"
          >
            <p
                class="main-toolbar-fade-text uppercase underline"
                style="font-size: 1.25rem"
            >HOME</p>
          </ion-button>
        </article>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent }                from 'vue';
import { IonButton, IonPage, IonContent } from '@ionic/vue';

import { useCurrentUser } from '@/composables/useCurrentUser';

export default defineComponent({
  name: "404",
  components: {
    IonButton,
    IonPage,
    IonContent,
  },
  setup() {
    /* Component properties */
    const { authUser, isEndUser } = useCurrentUser();

    return {
      /* Component properties */
      authUser,
      isEndUser,
    };
  },
});
</script>