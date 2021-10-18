<template>
  <div>
    <div
        v-for="staff in activeStaff"
        :key="staff.id"
        class="mt-4"
    >
      <StaffCard
          :staff="staff"
          :button="false"
      />
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue';

import StaffCard    from '@/components/staff/cards/StaffCard';
import { useStore } from 'vuex';


export default defineComponent({
  name: 'ActiveStaffMembers',
  components: {
    StaffCard,
  },
  setup() {
    /* Global properties */
    const store = useStore();

    /* Computed properties */
    const activeStaff = computed(() => {
      return store.getters['owner/staff'].filter(staff => staff.active);
    });

    return {
      activeStaff,
    };
  },
});
</script>

<style scoped>

</style>