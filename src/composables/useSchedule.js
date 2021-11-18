import { useStore } from 'vuex';

import { useCurrentUser }   from '@/composables/useCurrentUser';
import { useErrorHandling } from '@/composables/useErrorHandling';
import { useCache }         from '@/composables/useCache';

export function useSchedule() {
    /* Global properties */
    const store = useStore();

    /* Component properties */

    /* Composables */
    const { isStaff, isOwner } = useCurrentUser();
    const { tryCatch } = useErrorHandling();
    const { getCachedOrFetchSchedules } = useCache();

    /* Methods */
    /* Staff based methods */
    const fetchScheduleForStaff = async() => {
        if(isStaff.value) {
            await tryCatch(
                async() => {
                    await store.dispatch('staff/getSchedules');
                },
                null,
                'dataFetchingError',
            );
        }
    };
    const currentSchedule = (day, month, year) => {
        return store.getters['staff/schedule'](day, month, year);
    };
    const calculateEndTime = (schedule) => {
        const startHour = Number(schedule.start_time.split(':')[0]);
        const startMinutes = schedule.start_time.split(':')[1];
        let endHour = startHour + schedule.number_of_hours;

        if(endHour < 10) {
            endHour = `0${endHour}`;
        }
        if(endHour === 24) {
            endHour = '00';
        }

        return `${endHour}:${startMinutes}`;
    };

    /* Owner based methods */
    const fetchScheduleForOwner = async(force = false) => {
        if(isOwner.value) {
            await tryCatch(
                async() => {
                    await getCachedOrFetchSchedules(force);
                },
                null,
                'dataFetchingError',
            );
        }
    };
    const staffSchedules = (day, month, year) => {
        return store.getters['owner/schedules'](day, month, year);
    };
    const removeEmployeeFromSchedule = async(id) => {
        await tryCatch(
            async() => {
                await store.dispatch('owner/removeEmployeeFromSchedule', id);
            },
            'owner.successRemoveSchedule',
        );
    };

    return {
        /* Component properties */
        staffSchedules,
        currentSchedule,
        calculateEndTime,

        /* Methods */
        fetchScheduleForStaff,

        fetchScheduleForOwner,
        removeEmployeeFromSchedule,

    };
}

