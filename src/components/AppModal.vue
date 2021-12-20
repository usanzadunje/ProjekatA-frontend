<template>
  <ion-modal
      :css-class="cssClass + ' auto-height'"
      :is-open="isOpen"
      :backdrop-dismiss="true"
      :swipe-to-close="swipeToClose"
      @willPresent="initialize"
      @didPresent="$emit('didPresent')"
      @didDismiss="$emit('didDismiss')"
  >
    <div class="inner-content">
      <slot/>
    </div>
  </ion-modal>
</template>

<script>
import { defineComponent } from 'vue';
import { IonModal }        from '@ionic/vue';

export default defineComponent({
  name: 'AppModal',
  components: {
    IonModal,
  },
  emits: ['didPresent', 'didDismiss'],
  props: {
    cssClass: {
      type: String,
      required: false,
      default: 'custom-modal',
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
    height: {
      type: String,
      required: false,
      default: '',
    },
    width: {
      type: String,
      required: false,
      default: '100%',
    },
    swipeToClose: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  setup(props) {
    const initialize = () => {
      const modalRef = document.querySelector(`ion-modal.${props.cssClass}`);

      if(props.height) {
        modalRef.style.setProperty('--height', props.height);
      }

      if(props.width) {
        modalRef.style.setProperty('--width', props.width);
      }
    };

    return {
      initialize,
    };
  },
});
</script>
<style>

</style>