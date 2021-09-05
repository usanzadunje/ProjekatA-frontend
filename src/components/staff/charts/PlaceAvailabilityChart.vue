<template>
  <div>
    <canvas id="availability-chart" width="400" height="400"></canvas>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, reactive } from 'vue';
import { useStore }                                          from 'vuex';
import { useI18n }                                           from 'vue-i18n';

import {
  Chart,
  Legend,
  Tooltip,
  DoughnutController,
  ArcElement,
} from 'chart.js';

import ChartDataLabels from 'chartjs-plugin-datalabels';

export default defineComponent({
  name: "PlaceAvailabilityChart",
  components: {},
  setup() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    let chart = reactive({});

    /* Composables */
    const { t } = useI18n();


    /* Watchers */
    const unsubscribe = store.subscribe((mutation) => {
      if(mutation.type === 'staff/SET_AVAILABILITY_RATIO') {
        const ratio = mutation.payload.split('/');
        const empty = parseInt(ratio[0]);
        const taken = parseInt(ratio[1]) - empty;

        chart.config.data.datasets[0].data = [
          empty,
          taken,
        ];

        chart.update();
      }
    });

    /* Lifecycle hooks */
    onMounted(() => {
      const ctx = document.getElementById('availability-chart').getContext('2d');
      Chart.register(Legend, Tooltip, ChartDataLabels, DoughnutController, ArcElement);
      chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [
            t('staff.taken'),
            t('staff.empty'),
          ],
          datasets: [
            {
              data: [1, 2],
              backgroundColor: [
                '#e01b43',
                '#1B6DE0',
              ],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: 'right',
              labels: {
                color: '#000',
              },
            },
            datalabels: {
              display: true,
              align: 'center',
              color: '#FFF',
              font: {
                family: 'Poppins',
                size: 48,
                weight: 'bold',
              },
            },
          },
        },
      });
    });
    onUnmounted(() => {
      unsubscribe();
    });


    return {};
  },
});
</script>

<style scoped>

</style>