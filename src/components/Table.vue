<template>
  <div
      class="rounded-full"
      :class="{
        'draggable' : draggable, 'bg-green-500' : empty === 1, 'bg-red-500' : empty === 0, 'bg-yellow-800' : empty === null
      }"
  >
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useStore }                   from 'vuex';
import {}                             from '@ionic/vue';

import interact from 'interactjs';

export default defineComponent({
  name: 'Table',
  components: {},
  props: {
    draggable: {
      type: Boolean,
      default: true,
    },
    empty: {
      type: Number,
      default: null,
    },
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    // This is position relative to our parent which will be saved in DB
    let dropzone;
    let position = { x: 0, y: 0 };

    /* Lifecycle hooks */
    onMounted(() => {
      dropzone = document.querySelector("#dropzone");
    });
    /* Composables */
    /* Interact.js event handlers */
    const onMove = (event) => {
      position.x += Math.round(event.dx);
      position.y += Math.round(event.dy);

      event.target.style.transform =
          `translate(${position.x}px, ${position.y}px)`;
    };
    const dragOrClone = (event) => {
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
        element.style.transform = 'translate(0px, 0px)';
        element.classList.remove('bg-yellow-800');
        element.classList.add('bg-yellow-600');
        // Marking each element with unique ID so we can update them in Vuex storage
        // without this there is no way of identifying specific table in array for updates
        element.setAttribute('data-id', Date.now());
        // Marking cloned tables  so we are not showing them double from vuex store
        element.setAttribute('data-cloned', true);

        // Adding object inside parent container element
        dropzone && dropzone.appendChild(element);

        position.x = 0;
        position.y = 0;

        // If we are moving an already existing item, we need to make sure the position object has
        // the correct values before we start dragging it
      }else if(
          interaction.pointerIsDown &&
          !interaction.interacting()
      ) {
        updatePositionFromTransform(currentTarget);
      }

      // Start the drag event
      interaction.start({ name: "drag" }, event.interactable, element);
    };
    const updatePositionFromTransform = (element) => {
      const regex = /translate\(([\d]+)px, ([\d]+)px\)/i;
      const transform = regex.exec(element.style.transform);

      /* MARK POSITION VALUE */
      if(transform && transform.length > 1) {
        position.x = Number(transform[1]);
        position.y = Number(transform[2]);
      }
    };

    /* Lifecycle hooks */
    interact('.draggable').draggable({
      manualStart: true,
      autoScroll: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
        }),
      ],
      listeners: {
        start(event) {
          event.target.classList.add('opacity-60');
          updatePositionFromTransform(event.target);
        },
        move(event) {
          onMove(event);
        },
        end(event) {
          event.target.classList.remove('opacity-60');

          store.commit('owner/UPDATE_TABLE_POSITION', {
            id: Number(event.target.getAttribute('data-id')),
            position: {
              top: position.y,
              left: position.x,
              // This is calculating distance in % so it will be shown precise on any screen
              // -24 is because width of element is 24px which should not be calculated
              // left property is directly connected with transform value
              // Since it is calculated to % it will make buggy movement of existing table
              // Vuex value will be replaced with % but it need px to be shown correctly
              // So we make separate property for saving in DB as % and problem is solved.
              leftToSave: position.x / (event.target.parentElement.getBoundingClientRect().width - 24) * 100,
            },
            dirty: true,
            clone: Boolean(event.target.getAttribute('data-cloned')),
          });
        },
      },
    }).on('move', dragOrClone);

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
  width: 24px;
  height: 24px;
}
</style>
