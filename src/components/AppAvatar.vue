<template>
  <ion-thumbnail
      class="flex-shrink-0"
      :class="avatarImgClasses"
  >
    <img
        :class="avatarImgClasses"
        :alt="altText"
        :src="avatarPath"
    >
  </ion-thumbnail>
</template>
<script>
import { defineComponent } from 'vue';
import { IonThumbnail }    from '@ionic/vue';

export default defineComponent({
  name: 'AppAvatar',
  props: {
    avatarPath: {
      type: String,
      default: process.env.VUE_APP_STORED_IMAGES_URL + '/users/default_avatar.png',
    },
    altText: {
      type: String,
      default: 'Image of user avatar',
    },
    avatarImgClasses: {},
  },
  components: {
    IonThumbnail,
  },
  setup() {
    /* Global properties */
    /* Component properties */
    /* Composables */
    /* Event handlers */

    return {
      /* Component properties */
      /* Event handlers */
    };
  },
});
</script>
<style scoped>

</style>