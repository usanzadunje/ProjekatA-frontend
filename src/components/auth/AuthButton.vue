<template>
  <ion-button
      :color="color"
      :type="type"
      :href="href"
      size="large"
      expand="block"
      class="auth-button-border-radius"
  >
    {{ text }}
  </ion-button>
</template>

<script>
import { IonButton } from '@ionic/vue';

export default {
  name: 'AuthButton',
  components: {
    IonButton,
  },
  props: {
    color: {
      type: String,
      default: 'primary',
    },
    type: {
      type: String,
      default: 'submit',
    },
    text: {
      type: String,
      default: 'Click here',
    },
    text: {
      type: String,
      default: 'Click here',
    },
  },
};
</script>

<style scoped>
:focus {
  outline: none;
}
</style>