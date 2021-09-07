import CafeService from '@/services/CafeService';

export const namespaced = true;

export const state = {
    place: null,
    availabilityRatio: '0/0',
};

export const mutations = {
    SET_PLACE_INFO(state, value) {
        state.place = value;
    },
    SET_AVAILABILITY_RATIO(state, value) {
        state.availabilityRatio = value;
    },
};

export const actions = {
    async updatePlaceInfo({ commit, rootGetters }) {
        try {
            const response = await CafeService.show(rootGetters['auth/authUser'].cafe);
            commit("SET_PLACE_INFO", response.data);
        }catch(error) {
            console.log(error);
        }
    },
};

export const getters = {
    place: (state) => {
        return state.place;
    },
    availabilityRatio: (state) => {
        return state.availabilityRatio;
    },
};