import { useStore } from 'vuex';

import { getDaysInAMonth } from '@/utils/helpers';


export function useDaysOffRequest() {
    /* Global properties */
    const store = useStore();

    /* Component properties */

    /* Methods */
    const addDaysOffRequest = async(payload) => {
        await store.dispatch('staff/addDayOffRequests', payload);

        addDaysToCorrectMonth(payload);
    };

    const addDaysToCorrectMonth = ({ dayOffStartDate, numberOfDays }) => {
        const dateParts = dayOffStartDate.split('-');
        let day = Number(dateParts[0]);
        let month = Number(dateParts[1]) - 1;
        let year = Number(dateParts[2]);

        store.commit('staff/ADD_DAY_OFF_TO_MONTH', {
            day,
            month,
            year,
        });

        for(let i = 1; i < numberOfDays; i++) {
            const daysInAMonthLeft = getDaysInAMonth(month) - day;
            if(daysInAMonthLeft === 0) {
                if(month + 1 <= 11) {
                    month++;
                }else {
                    month = 0;
                    year++;
                }
                day = 0;
            }

            store.commit('staff/ADD_DAY_OFF_TO_MONTH', {
                day: ++day,
                month,
                year,
            });
        }
    };

    const dayOffRequestedDays = (year, month) => {
        return store.getters['staff/dayOffRequestedDays'](year, month);
    };

    return {
        /* Component properties */
        dayOffRequestedDays,

        /* Methods */
        addDaysOffRequest,
    };
}

