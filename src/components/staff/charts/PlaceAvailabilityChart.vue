<template>
  <div>
    <canvas id="availability-chart" width="400" height="400"></canvas>
  </div>
</template>

<script>
import { defineComponent, onMounted, onUnmounted, reactive } from 'vue';
import { useStore }                                          from 'vuex';
import { useI18n }                                           from 'vue-i18n';

import { useToastNotifications } from '@/composables/useToastNotifications';

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
    const { showErrorToast } = useToastNotifications();


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
      if(mutation.type === 'user/SET_DARKMODE') {
        if(mutation.payload) {
          chart.options.plugins.legend.labels.color = '#F0F0F2';
        }else {
          chart.options.plugins.legend.labels.color = '#232B38';
        }
        chart.update();
      }
    });

    /* Lifecycle hooks */
    onMounted(() => {
      try {
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
                  '#10B981',
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
                  color: store.getters['user/darkMode'] ? '#F0F0F2' : '#232B38',
                },
              },
              datalabels: {
                display: true,
                align: 'center',
                color: '#FFF',
                font: {
                  family: 'Poppins',
                  size: 36,
                  weight: 'bold',
                },
              },
            },
          },
        });
      }catch(e) {
        showErrorToast(
            null,
            {
              dataFetchingError: t('dataFetchingError'),
            });
      }
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