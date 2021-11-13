import StaffService from '@/services/StaffService';

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

    SET_DAY_OFF_REQUESTS(state, payload) {
        state.dayOffRequests = payload;
    },
    ADD_DAY_OFF_TO_MONTH(state, { day, month, year }) {
        let existingYear = state.dayOffRequests.find(request => request.year === year);

        if(existingYear) {
            let existingMonth = existingYear.months?.find(m => m.month === month);
            if(existingMonth) {
                if(!existingMonth.days.includes(day)) {
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

    async getDayOffRequests({ commit }, payload) {
        //API call
        commit('SET_DAY_OFF_DAYS', payload);
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