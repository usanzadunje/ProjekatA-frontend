<template>
  <div class="accordion-list-box">
    <div @click="togglePane" class="flex justify-between py-2.5">
      <div>
        <ion-icon :icon="locationOutline" class="align-middle text-gray-400"></ion-icon>
        <p class="inline-block ml-2.5 cafe-show-menu-headers">{{ title }}</p>
      </div>
      <ion-icon :icon="isPanelOpen ? chevronForwardOutline : chevronDownOutline" class="mt-1 text-gray-400"></ion-icon>
    </div>
    <div class="panel" @click="togglePane($event, true)">
      <div v-for="item in items" :key="item">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

import {
  IonIcon,
} from '@ionic/vue';

import {
  locationOutline,
  chevronDownOutline,
  chevronForwardOutline,
} from 'ionicons/icons';

export default defineComponent({
  name: "AccordionList",
  components: {
    IonIcon,
  },
  props: {
    title: {
      type: String,
      default: 'Title',
    },
    items: {
      type: Array,
      default: null,
    },
  },
  setup() {
    /* Component properties */
    const isPanelOpen = ref(false);

    /* Methods */
    const togglePane = (e, paneClicked = false) => {
      /*
       Select HTML element accordingly to what has been clicked, if header has been clicked
       select sibling(panel element) if panel has been clicked select itself.
      */
      let panel = paneClicked ? e.currentTarget : e.currentTarget.nextElementSibling;
      if(panel.style.maxHeight) {
        panel.style.maxHeight = null;
      }else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
      isPanelOpen.value = !isPanelOpen.value;
    };


    return {
      /* Component properties */
      isPanelOpen,

      /* Methods */
      togglePane,

      /* Icons from */
      locationOutline,
      chevronDownOutline,
      chevronForwardOutline,
    };

  },
});
</script>