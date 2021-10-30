<template>
  <ion-content class="ion-no-padding" :scrollY="false">
    <div>
      <div
          v-for="(icon, index) in availableIcons"
          :key="index"
          class="p-2 inline-block"
      >
        <ion-button
            fill="clear"
            slot="icon-only"
            class="reset-button-size"
            @click="chooseIcon(icon)"
        >
          <ion-icon
              slot="icon-only"
              :icon="icons[icon]"
              class="text-2xl text-gray-500"
          ></ion-icon>
        </ion-button>
      </div>
    </div>
  </ion-content>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonContent,
  IonButton,
  IonIcon,
  popoverController,
}                          from '@ionic/vue';

export default defineComponent({
  name: 'IconChoicePopover',
  components: {
    IonContent,
    IonButton,
    IonIcon,
  },
  props: {
    icons: {
      type: Object,
      default: null,
      required: true,
    },
  },
  setup() {
    /* Global properties */
    /* Component properties */
    const availableIcons = [
      'barbellOutline',
      'balloonOutline',
      'bagHandleOutline',
      'beerOutline',
      'bookOutline',
      'cafeOutline',
      'cartOutline',
      'fastFoodOutline',
      'fishOutline',
      'heartOutline',
      'iceCreamOutline',
      'leafOutline',
      'nutritionOutline',
      'pawOutline',
      'pizzaOutline',
      'restaurantOutline',
      'ribbonOutline',
      'rocketOutline',
      'roseOutline',
      'snowOutline',
      'starOutline',
      'storefrontOutline',
      'sunnyOutline',
      'thumbsUpOutline',
      'wineOutline',
      'walletOutline',
      'trashOutline',
      'timeOutline',
    ];

    /* Event handlers */
    const chooseIcon = (icon) => {
      popoverController.dismiss({ icon });
    };
    return {
      /* Component properties */
      availableIcons,

      /* Event handlers */
      chooseIcon,

      /* Icons */
    };
  },
});
</script>
<style scoped>
ion-content {
  --background: var(--input-bg) !important;
  background: var(--input-bg) !important;
}
</style>