import OwnerService from '@/services/OwnerService';

export const namespaced = true;

export const state = {
    staff: [],
};

export const mutations = {
    SET_STAFF_MEMBERS(state, value) {
        state.staff = value;
    },
    REMOVE_STAFF_MEMBER(state, id) {
        state.staff = state.staff.filter(member => member.id !== id);
    },
};

export const actions = {
    async getStaffInfo({ commit }) {
        try {
            const response = await OwnerService.allStaff();

            commit('SET_STAFF_MEMBERS', response.data);
        }catch(error) {
            commit("SET_STAFF_MEMBERS", []);
        }
    },
    async deleteStaff({ commit }, staffId) {
        await OwnerService.deleteStaff(staffId);
        commit('REMOVE_STAFF_MEMBER', staffId);
    },
};

export const getters = {
    staff: (state) => {
        return state.staff;
    },
};