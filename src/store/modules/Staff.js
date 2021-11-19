import StaffService             from '@/services/StaffService';
import DaysOffService           from '@/services/DaysOffService';
import { getDayFromDateString } from '@/utils/helpers';
import ScheduleService          from '@/services/ScheduleService';

export const namespaced = true;

export const state = {
    availabilityRatio: '0/0',
    active: false,
    dayOffRequests: [],
    schedule: [],
};

export const mutations = {
    SET_AVAILABILITY_RATIO(state, payload) {
        state.availabilityRatio = payload;
    },

    SET_ACTIVITY(state, payload) {
        state.active = payload;
    },

    /* DAY OFF REQUESTS */
    SET_DAY_OFF_REQUESTS(state, payload) {
        state.dayOffRequests = payload;
    },
    ADD_DAY_OFF_REQUEST(state, payload) {
        state.dayOffRequests.push(payload);
    },
    UPDATE_DAY_OFF_REQUEST(state, { id, payload }) {
        let existingRequest = state.dayOffRequests.find(request => request.id === id);

        Object.keys(payload).forEach(key => existingRequest[key] = payload[key]);
    },
    UPDATE_DAY_OFF_REQUEST_STATUSES(state, payload) {
        payload.forEach(freshRequest => {
            const existingRequest = state.dayOffRequests.find(request => request.id === freshRequest.id);
            if(existingRequest) {
                existingRequest.status = freshRequest.status;
            }
        });
    },
    REMOVE_DAY_OFF_REQUEST(state, payload) {
        state.dayOffRequests = state.dayOffRequests.filter(request => request.id !== payload);
    },
    PURGE_DAY_OFF_REQUESTS_DATA(state) {
        state.dayOffRequests = [];
    },

    /* SCHEDULE */
    SET_SCHEDULES(state, payload) {
        state.schedule = payload;
    },
    ADD_SCHEDULE(state, payload) {
        state.schedule.push(payload);
    },
    UPDATE_SCHEDULE(state, { id, payload }) {
        let existingSchedule = state.schedule.find(schedule => schedule.id === id);

        Object.keys(payload).forEach(key => existingSchedule[key] = payload[key]);
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
        const response = await DaysOffService.index();

        commit('SET_DAY_OFF_REQUESTS', response.data);
    },
    async getDayOffRequestStatuses({ commit }) {
        const response = await DaysOffService.statuses();

        commit('UPDATE_DAY_OFF_REQUEST_STATUSES', response.data);
    },
    async addDayOffRequest({ commit }, payload) {
        const response = await DaysOffService.store(payload);

        commit('ADD_DAY_OFF_REQUEST', { ...response.data, status: 0 });
    },
    async updateDayOffRequest({ commit }, { id, payload }) {
        const response = await DaysOffService.update(id, payload);

        commit('UPDATE_DAY_OFF_REQUEST', {
            id,
            payload: {
                ...payload,
                status: 0,
                end_date: response.data.end_date,
            },
        });
    },

    /* SCHEDULE */
    async getSchedules({ commit }) {
        const response = await ScheduleService.index();

        commit('SET_SCHEDULES', response.data);
    },
};

export const getters = {
    availabilityRatio: (state) => {
        return state.availabilityRatio;
    },
    active: (state) => {
        return state.active;
    },

    dayOffRequestedDays: (state) => (month, year) => {
        const requests = [];

        for(let i = state.dayOffRequests.length - 1; i >= 0; i--) {
            const request = state.dayOffRequests[i];

            if(request.month === month && request.year === year) {
                requests.push(request);
            }
        }

        return requests;
    },

    dayOffRequestedDay: (state) => (day, month, year) => {
        return state.dayOffRequests?.find(
            request => day >= request.day &&
                day <= getDayFromDateString(request.end_date) &&
                request.month === month &&
                request.year === year,
        );
    },
    schedule: (state) => (day, month, year) => {
        return state.schedule.find(
            schedule =>
                schedule.day >= day &&
                schedule.day < day + 7 &&
                schedule.month === month &&
                schedule.year === year,
        );
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