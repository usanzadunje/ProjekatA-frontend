<template>
  <div
      class="draggable bg-yellow-800 h-6 w-6 rounded-full"
      :class="{ 'absolute': absolute }"
      :style="`top:${top}px; left:${left}px`"
  >
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import {}                  from '@ionic/vue';

import interact from 'interactjs';

export default defineComponent({
  name: 'Table',
  components: {},
  props: {
    top: {
      type: Number,
      default: 0,
    },
    left: {
      type: Number,
      default: 0,
    },
    absolute: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    // This is position relative to our parent which will be saved in DB
    const position = { x: 0, y: 0 };


    /* Global properties */

    /* Component properties */

    /* Composables */

    /* Interact.js event handlers */
    const onMove = (event) => {
      position.x += event.dx;
      position.y += event.dy;

      event.target.style.transform =
          `translate(${position.x}px, ${position.y}px)`;
    };

    const cloneTable = (event) => {
      const { currentTarget, interaction } = event;
      let element = currentTarget;

      // If we are dragging an item from the sidebar, its transform value will be ''
      // We need to clone it, and then start moving the clone
      if(
          interaction.pointerIsDown &&
          !interaction.interacting() &&
          currentTarget.style.transform === ""
      ) {
        element = currentTarget.cloneNode(true);

        // Making clone absolute so we can position it it top left corner of container
        // element which will be the rect that represents places room
        element.style.position = "absolute";
        element.style.left = 0;
        element.style.top = 0;

        // Adding object inside parent container element
        const container = document.querySelector("#dropzone");
        container && container.appendChild(element);

        position.x = 0;
        position.y = 0;

        // If we are moving an already existing item, we need to make sure the position object has
        // the correct values before we start dragging it
      }else if(interaction.pointerIsDown && !interaction.interacting()) {
        const regex = /translate\(([\d]+)px, ([\d]+)px\)/i;
        const transform = regex.exec(currentTarget.style.transform);

        if(transform && transform.length > 1) {
          position.x = Number(transform[1]);
          position.y = Number(transform[2]);
        }
      }

      // Start the drag event
      interaction.start({ name: "drag" }, event.interactable, element);
    };
    /* Lifecycle hooks */
    interact('.draggable').draggable({
      manualStart: true,
      autoScroll: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true,
        }),
      ],
      listeners: {
        start(event) {
          event.target.classList.add('opacity-60');
        },
        move(event) {
          onMove(event);
        },
        end(event) {
          event.target.classList.remove('opacity-60');
          // Execute logic that will notify parent component
          // that new element has been added or changed
        },
      },
    }).on('move', cloneTable);

    /* Event handlers */


    return {
      /* Component properties */

      /* Event handlers */

      /* Icons */
    };
  },
});

</script>
<style scoped>
div {
  touch-action: none;
  user-select: none;
}
</style>
