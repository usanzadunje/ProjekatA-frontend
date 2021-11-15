import { useStore } from 'vuex';

import { useCurrentUser }   from '@/composables/useCurrentUser';
import { useErrorHandling } from '@/composables/useErrorHandling';

import { addDaysToCorrectMonth } from '@/services/DaysOffService';

export function useDaysOffRequest() {
    /* Global properties */
    const store = useStore();

    /* Component properties */
    const PENDING = 0;
    const DECLINED = 1;
    const APPROVED = 2;

    /* Composables */
    const { isStaff, isOwner } = useCurrentUser();
    const { tryCatch } = useErrorHandling();

    /* Methods */
    /* Staff based methods */
    const fetchRequestedDaysOffForStaff = async() => {
        if(isStaff.value) {
            await tryCatch(
                async() => {
                    await store.dispatch('staff/getDayOffRequests');
                },
                null,
                'dataFetchingError',
            );
        }
    };
    const addDaysOffRequest = async(payload) => {
        await store.dispatch('staff/addDayOffRequests', {
            start_date: payload.dayOffStartDate,
            number_of_days: payload.numberOfDays,
            message: payload.message,
        });

        addDaysToCorrectMonth({ ...payload, status: PENDING });
    };
    const dayOffRequestedDay = (year, month, day) => {
        return store.getters['staff/dayOffRequestedDay'](year, month, day);
    };
    const dayOffRequestedDays = (year, month) => {
        return store.getters['staff/dayOffRequestedDays'](year, month);
    };
    const dayOffRequestedDayStatus = (day, month, year) => {
        return dayOffRequestedDay(year, month, day)?.status;
    };
    const alreadyHavePendingRequestAtDate = (day, month, year) => {
        const requestExists = dayOffRequestedDay(year, month, day);
        return !!requestExists && requestExists?.status === PENDING;
    };
    const alreadyHaveApprovedRequestAtDate = (day, month, year) => {
        const requestExists = dayOffRequestedDay(year, month, day);
        return !!requestExists && requestExists?.status === APPROVED;
    };
    const declinedRequestAtDate = (day, month, year) => {
        const requestExists = dayOffRequestedDay(year, month, day);
        return !!requestExists && requestExists?.status === DECLINED;
    };

    /* Owner based methods */
    const fetchRequestedDaysOffFromStaff = async() => {
        if(isOwner.value) {
            await tryCatch(
                async() => {
                    await store.dispatch('owner/getDayOffRequests');
                },
                null,
                'dataFetchingError',
            );
        }
    };
    const approveRequest = async(id, staff, event = null) => {
        event?.stopPropagation();

        await tryCatch(
            async() => {
                await store.dispatch('owner/approveDayOffRequest', id);
            },
            'successApprovedDayOffRequest',
            'generalAlertError',
            null,
            {
                staff,
            },
        );
    };
    const declineRequest = async(id, staff, event = null) => {
        event?.stopPropagation();

        await tryCatch(
            async() => {
                await store.dispatch('owner/declineDayOffRequest', id);
            },
            'successDeclinedDayOffRequest',
            'generalAlertError',
            null,
            {
                staff,
            },
        );
    };

    return {
        /* Component properties */
        PENDING,
        DECLINED,
        APPROVED,
        dayOffRequestedDay,
        dayOffRequestedDays,
        dayOffRequestedDayStatus,

        /* Methods */
        addDaysOffRequest,
        alreadyHavePendingRequestAtDate,
        alreadyHaveApprovedRequestAtDate,
        fetchRequestedDaysOffForStaff,
        fetchRequestedDaysOffFromStaff,
        declinedRequestAtDate,
        approveRequest,
        declineRequest,
    };
}

