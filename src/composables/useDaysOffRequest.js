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
        await store.dispatch('staff/addDayOffRequests', payload);

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
    const staffRequestsForSelectedDate = (month, year) => {
        return store.getters['owner/dayOffRequests'].filter(request => {
            const dateParts = request.start_date.split('-');
            const requestMonth = Number(dateParts[1]) - 1;
            const requestYear = Number(dateParts[2]);

            if(requestMonth === month && requestYear === year) {
                return request;
            }
        });
    };
    const approveRequest = async(id, staff) => {
        await tryCatch(
            async() => {
                await store.dispatch('owner/approveDayOffRequest', id);
            },
            'successApprovedDayOffRequest',
            'generalAlertError',
            null,
            {
                staff
            }
        );
    };
    const declineRequest = async(id, staff) => {
        await tryCatch(
            async() => {
                await store.dispatch('owner/declineDayOffRequest', id);
            },
            'successDeclinedDayOffRequest',
            'generalAlertError',
            null,
            {
                staff
            }
        );
    };

    return {
        /* Component properties */
        PENDING,
        DECLINED,
        APPROVED,
        staffRequestsForSelectedDate,
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

