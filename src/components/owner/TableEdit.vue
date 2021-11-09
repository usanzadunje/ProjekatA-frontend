<template>
  <div>
    <TableContainer class="mt-10">
      <Table
          v-for="table in tables"
          :key="table.id"
          :draggable="true"
          :data-id="table.id"
          :style="
            `position: absolute;
            top: 0; left: 0;
            transform:translate(${table.position?.left}px, ${table.position.top}px);
            `
          "
          @click="$emit('openTableEditModal', table)"
      />
    </TableContainer>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import TableContainer from '@/components/TableContainer';
import Table          from '@/components/Table';

export default defineComponent({
  name: 'TheOwnerSegmentNavigation',
  components: {
    TableContainer,
    Table,
  },
  props: {
    tables: {
      type: Object,
      default: null,
      required: true,
    },
  },
  emits: ['openTableEditModal'],
  setup() {
    /* Global properties */

    /* Component properties */

    /* Composables */


    /* Event handlers */


    return {
      /* Global properties */

      /* Component properties */

      /* Event handlers */

      /* Icons */
    };
  },
});

</script>
<style scoped>

</style>
