import OwnerService from '@/services/OwnerService';

export const namespaced = true;

export const state = {
    staff: [],
};

export const mutations = {
    SET_STAFF_MEMBERS(state, value) {
        state.staff = value;
    },
    UPDATE_STAFF_MEMBER(state, { staffId, user }) {
        state.staff.forEach(staff => {
            if(staff.id === staffId) {
                Object.keys(user).forEach(key => {
                    staff[key] = user[key];
                });
            }
        });
    },
    REMOVE_STAFF_MEMBER(state, id) {
        state.staff = state.staff.filter(member => member.id !== id);
    },
};

export const actions = {
    async getStaffInfo({ commit }) {
        const response = await OwnerService.allStaff();

        commit('SET_STAFF_MEMBERS', response.data);
    },
    async createStaff({ dispatch }, user) {
        await OwnerService.createStaff(user);

        dispatch("getStaffInfo");
    },
    async updateStaff({ commit }, { staffId, user }) {
        await OwnerService.updateStaff(staffId, user);

        commit('UPDATE_STAFF_MEMBER', { staffId, user });
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