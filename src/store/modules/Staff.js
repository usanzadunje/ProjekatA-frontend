import CafeService  from '@/services/CafeService';
import OwnerService from '@/services/OwnerService';
import StaffService from '@/services/StaffService';

export const namespaced = true;

export const state = {
    place: null,
    availabilityRatio: '0/0',
    active: false,
};

export const mutations = {
    SET_PLACE_INFO(state, value) {
        state.place = value;
    },
    SET_AVAILABILITY_RATIO(state, value) {
        state.availabilityRatio = value;
    },
    SET_ACTIVITY(state, value) {
        state.active = value;
    },
};

export const actions = {
    async getPlaceInfo({ commit, rootGetters }) {
        const response = await CafeService.show(rootGetters['auth/authUser'].cafe);
        commit('SET_PLACE_INFO', response.data);
        commit('SET_AVAILABILITY_RATIO', response.data?.availability_ratio ?? '0/0');
    },

    async updatePlaceInfo({ commit }, place) {
        await OwnerService.updatePlace(place);

        commit('SET_PLACE_INFO', place);
    },

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
    place: (state) => {
        return state.place;
    },
    availabilityRatio: (state) => {
        return state.availabilityRatio;
    },
    active: (state) => {
        return state.active;
    },
};