<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <div class="px-4 pt-3 pb-2 md header-padding-bottom">
        <div v-if="loggedIn" class="flex items-center justify-between">
          <p class="main-toolbar-fade-text">
            {{ $t('hello') }}
            <span class="break-all">
              {{ displayName }}!
            </span>
          </p>

          <NotificationsPreview/>
        </div>
        <div v-if="!loggedIn" class="flex justify-around mb-4">
          <ion-button
              fill="clear"
              routerLink="/login"
              class="py-2"
          >
            <span class="main-toolbar-fade-text uppercase">{{ $t('login') }}</span>
          </ion-button>
          <ion-button
              fill="clear"
              class="py-2"
              @click="this.$router.replace({ name: 'register' })"
          >
            <span class="main-toolbar-fade-text uppercase">{{ $t('register') }}</span>
          </ion-button>
        </div>

        <h1 class="main-toolbar-heading text-xl mt-2">{{ mainHeading }}</h1>

        <div>
          <ion-searchbar
              :value="searchTerm"
              :placeholder="$t('searchPlaceholder')"
              @keyup.enter="searchEnterPressed($event)"
              enterkeyhint="search"
              class="no-left-padding"
              @ionChange="searchInputChanged"
          ></ion-searchbar>
        </div>
        <slot></slot>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script>
import { defineComponent }                                from 'vue';
import { mapGetters }                                     from 'vuex';
import { IonHeader, IonSearchbar, IonToolbar, IonButton } from '@ionic/vue';

import NotificationsPreview from '@/components/user/NotificationsPreview';

import { hideNativeKeyboard } from '@/composables/useDevice';

export default defineComponent({
  name: 'TheUserHeader',
  components: {
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonButton,
    NotificationsPreview,
  },
  props: {
    // hasSearchFilter: Boolean,
    mainHeading: String,
    searchTerm: String,
  },
  computed: {
    ...mapGetters('auth', ['authUser', 'displayName', 'loggedIn']),
  },
  emits: ['searchFilterChanged', 'searchEnterPressed'],
  setup(props, { emit }) {
    /* Component properties */

    /* Event handlers */
    const searchInputChanged = (e) => {
      emit('searchFilterChanged', e.target.value);
    };
    const searchEnterPressed = (e) => {
      hideNativeKeyboard();
      emit('searchEnterPressed', e);
    };


    return {
      /* Component properties */

      /* Event handlers */
      searchInputChanged,
      searchEnterPressed,

      /* Icons from */
    };
  },
});
</script>
<style scoped>
ion-button {
  height: auto;
}

ion-toolbar::part(open) {
  padding: 0 !important;
}
</style>
