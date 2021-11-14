import StaffService                              from '@/services/StaffService';
import DaysOffService, { addDaysToCorrectMonth } from '@/services/DaysOffService';

export const namespaced = true;

export const state = {
    availabilityRatio: '0/0',
    active: false,
    dayOffRequests: [],
};

export const mutations = {
    SET_AVAILABILITY_RATIO(state, payload) {
        state.availabilityRatio = payload;
    },

    SET_ACTIVITY(state, payload) {
        state.active = payload;
    },

    /* DAY OFF REQUESTS */
    ADD_DAY_OFF_TO_MONTH(state, { day, month, year }) {
        let existingYear = state.dayOffRequests.find(y => y.year === year);

        if(existingYear) {
            let existingMonth = existingYear.months?.find(m => m.month === month);
            if(existingMonth) {
                if(!existingMonth.days.some(d => d.number === day)) {
                    existingMonth.days.push(day);
                }
            }else {
                existingYear.months.push({
                    month,
                    days: [day],
                });
            }
        }else {
            state.dayOffRequests.push({
                year,
                months: [
                    {
                        month,
                        days: [day],
                    },
                ],
            });
        }
    },
    PURGE_DAY_OFF_REQUESTS_DATA(state) {
        state.dayOffRequests = [];
    },
};

export const actions = {
    async updatePlaceAvailability({ commit }) {
        const response = await StaffService.tableAvailability();

        commit('SET_AVAILABILITY_RATIO', response.data?.availability_ratio ?? '0/0');
    },

    async toggleActivity({ commit }, payload) {
        const requestPayload = {
            active: payload,
        };
        await StaffService.toggleActivity(requestPayload);

        commit('SET_ACTIVITY', payload);
    },

    async getDayOffRequests({ commit }) {
        commit('PURGE_DAY_OFF_REQUESTS_DATA');

        const response = await DaysOffService.index();

        response.data.forEach(request => {
            addDaysToCorrectMonth({
                dayOffStartDate: request.start_date,
                numberOfDays: request.number_of_days,
                status: request.status,
            });
        });
    },
    async addDayOffRequests(context, payload) {
        //API call
        console.log(payload);
    },
};

export const getters = {
    availabilityRatio: (state) => {
        return state.availabilityRatio;
    },
    active: (state) => {
        return state.active;
    },

    dayOffRequestedDays: (state) => (year, month) => {
        const yearlyRequests = state.dayOffRequests.find(y => y.year === year);

        const monthlyRequests = yearlyRequests?.months?.find(m => m.month === month);

        return monthlyRequests?.days ?? [];
    },

    dayOffRequestedDay: (state) => (year, month, day) => {
        const yearlyRequests = state.dayOffRequests.find(y => y.year === year);

        const monthlyRequests = yearlyRequests?.months?.find(m => m.month === month);

        return monthlyRequests?.days?.find(d => d.number === day);
    },

    scheduleSegments: () => {
        return [
            {
                text: 'schedule',
                value: 'staff.schedule',
            },
            {
                text: 'daysOff',
                value: 'staff.schedule.daysOff',
            },
        ];
    },
};