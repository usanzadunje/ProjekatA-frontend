<template>
  <div class="accordion-list-box">
    <div @click="togglePane" class="flex justify-between py-2.5">
      <div>
        <ion-icon :icon="locationInactiveOutline" class="align-middle"></ion-icon>
        <p class="inline-block ml-2.5 cafe-show-menu-headers">{{ title }}</p>
      </div>
      <ion-icon :icon="isPanelOpen ? locationInactiveOutline : arrowDownwardOutline" class="mt-1"></ion-icon>
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
  locationInactiveOutline,
  arrowDownwardOutline,
} from '@/assets/icons';

export default defineComponent({
  name: "MyAccordion",
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
    /* Properties */
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
      /* Properties */
      isPanelOpen,

      /* Methods */
      togglePane,

      /* Icons */
      locationInactiveOutline,
      arrowDownwardOutline,
    };

  },
});
</script>