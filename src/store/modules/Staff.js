import StaffService from '@/services/StaffService';

export const namespaced = true;

export const state = {
    availabilityRatio: '0/0',
    active: false,
};

export const mutations = {
    SET_AVAILABILITY_RATIO(state, value) {
        state.availabilityRatio = value;
    },

    SET_ACTIVITY(state, value) {
        state.active = value;
    },
};

export const actions = {
    async updatePlaceAvailability({ commit }) {
        const response = await StaffService.tableAvailability();

        commit('SET_AVAILABILITY_RATIO', response.data?.availability_ratio ?? '0/0');
    },

    async toggleActivity({ commit }, value) {
        const payload = {
            active: value,
        };
        await StaffService.toggleActivity(payload);

        commit('SET_ACTIVITY', value);
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