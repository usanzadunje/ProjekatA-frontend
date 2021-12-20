<template>
  <div
      v-if="this.$store.getters['auth/loggedIn']"
      class="text-yellow-400 transition-all duration-1000"
      @click="toggleFavoritePlace"
  >
    <ion-icon
        :icon="userFavorite ? star : starOutline"
        :style="`font-size: ${iconSize}px`"
        class="transition-all duration-1000"
    ></ion-icon>
  </div>
</template>
<script>
import { computed, defineComponent, toRefs } from 'vue';
import { useStore }                          from 'vuex';
import { IonIcon }                           from '@ionic/vue';

import { useErrorHandling } from '@/composables/useErrorHandling';

import {
  star,
  starOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: 'AppFavoriteButton',
  props: {
    place: {
      type: Object,
      default: null,
      required: true,
    },
    iconSize: {
      type: Number,
      default: 17,
      required: false,
    },
  },
  components: {
    IonIcon,
  },
  setup(props) {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const { place } = toRefs(props);
    const userFavorite = computed(() => store.getters['user/hasInFavorites'](place.value.id));

    /* Composables */
    const { tryCatch } = useErrorHandling();

    /* Event handlers */
    const toggleFavoritePlace = async(event = null) => {
      event?.stopPropagation();

      if(!userFavorite.value) {
        event.target.classList.remove('scale-100');
        event.target.classList.add('scale');
        setTimeout(() => {
          event.target.classList.remove('scale');
          event.target.classList.add('scale-100');
        }, 650);
      }

      const toggleMutation = userFavorite.value ? "user/removeFavoritePlace" : "user/addFavoritePlace";

      await tryCatch(
          async() => {
            await store.dispatch(toggleMutation, place.value);
          },
          {
            successMessageKey: userFavorite.value ? 'successRemovedFavorite' : 'successAddedFavorite',
            errorMessageKey: 'generalAlertError',
            successMessageParams: {
              place: place.value.name,
            },
          },
      );
    };

    return {
      /* Component properties */
      userFavorite,

      /* Event handlers */
      toggleFavoritePlace,

      /* Icons */
      star,
      starOutline,
    };
  },
});
</script>
<style scoped>
.scale {
  transform: scale(2);
}
</style>