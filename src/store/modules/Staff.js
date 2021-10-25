import StaffService from '@/services/StaffService';

export const namespaced = true;

export const state = {
    availabilityRatio: '0/0',
    active: false,
};

export const mutations = {
    SET_AVAILABILITY_RATIO(state, payload) {
        state.availabilityRatio = payload;
    },

    SET_ACTIVITY(state, payload) {
        state.active = payload;
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
};

export const getters = {
    availabilityRatio: (state) => {
        return state.availabilityRatio;
    },
    active: (state) => {
        return state.active;
    },
};