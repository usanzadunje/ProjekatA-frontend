import OwnerService from '@/services/OwnerService';

export const namespaced = true;

export const state = {
    staff: [],
    tables: [],
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
    SET_TABLES(state, value) {
        state.tables = value;
    },
    UPDATE_TABLES(state, value) {
        let existingTable = state.tables.find(table => table.id === value.id);

        if(existingTable) {
            existingTable.position = value.position;
            existingTable.dirty = value.dirty;
        }else {
            state.tables.push(value);
        }
    },
    CHANGE_TABLE_DIRTY_TO_CLEAN(state) {
        state.tables.map(table => {
            if(table.dirty) {
                table.dirty = false;
            }
        });
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
    async getTables({ commit }) {
        const response = await OwnerService.allTables();

        commit('SET_TABLES', response.data);

        // Since vuex is getting populated with tables that are stored in DB
        // these cloned ones will still stay and be duplicated with ones returned
        // to avoid this we remove cloned tables and keep only fresh ones from real DB
        document.querySelectorAll('[data-cloned="true"]').forEach(clonedTable => {
            document.querySelector("#dropzone").removeChild(clonedTable);
        });
    },
    async updateTables({ getters, commit, dispatch }) {
        const dirtyTables = getters.tables.filter(table => {
            return table.dirty;
        });

        await OwnerService.updateTables(dirtyTables);

        commit('CHANGE_TABLE_DIRTY_TO_CLEAN');

        dispatch('getTables');
    },
};

export const getters = {
    staff: (state) => {
        return state.staff;
    },
    tables: (state) => {
        return state.tables;
    },
};