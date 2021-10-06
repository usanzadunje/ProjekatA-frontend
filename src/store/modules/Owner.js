import OwnerService from '@/services/OwnerService';

import { calculatePxFromPercent } from '@/utils/helpers';
import CategoryService            from '@/services/CategoryService';
import ProductService             from '@/services/ProductService';

export const namespaced = true;

export const state = {
    staff: [],
    tables: [],
    categories: [],
    products: [],
};

export const mutations = {
    SET_STAFF_MEMBERS(state, value) {
        state.staff = value;
    },
    UPDATE_STAFF_MEMBER(state, { staffId, user }) {
        let staff = state.staff.find(staff => staff.id === staffId);

        Object.keys(user).forEach(key => {
            staff[key] = user[key];
        });
    },
    REMOVE_STAFF_MEMBER(state, id) {
        state.staff = state.staff.filter(member => member.id !== id);
    },
    SET_TABLES(state, value) {
        state.tables = value;
    },
    SET_TABLE_LEFT_POSITION(state, dropzoneWidth) {
        state.tables.forEach(table => {
            table.position.left = calculatePxFromPercent(table.position.left, dropzoneWidth);
        });
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
    SET_CATEGORIES(state, value) {
        state.categories = value;
    },
    UPDATE_CATEGORY(state, { id, value }) {
        let category = state.categories.find(category => category.id === id);

        category.name = value;
    },
    REMOVE_CATEGORY(state, id) {
        state.categories = state.categories.filter(category => category.id !== id);
    },
    SET_PRODUCTS(state, value) {
        state.products = value;
    },
    UPDATE_PRODUCT(state, { id, value }) {
        let product = state.products.find(product => product.id === id);

        Object.keys(value).forEach(key => {
            product[key] = value[key];
        });
    },
    REMOVE_PRODUCT(state, id) {
        state.products = state.products.filter(product => product.id !== id);
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
        const dirtyTables = getters.tables.filter(table => table.dirty);

        await OwnerService.updateTables(dirtyTables);

        commit('CHANGE_TABLE_DIRTY_TO_CLEAN');

        await dispatch('getTables');
    },
    async getCategories({ commit }) {
        const response = await CategoryService.index();

        commit('SET_CATEGORIES', response.data);
    },
    async createCategory({ dispatch }, value) {
        const payload = {
            category: value,
        };

        await CategoryService.create(payload);

        await dispatch('getCategories');
    },
    async updateCategory({ commit }, { id, value }) {
        const payload = {
            category: value,
        };

        await CategoryService.update(id, payload);

        commit('UPDATE_CATEGORY', { id, value });
    },
    async deleteCategory({ commit }, id) {
        await CategoryService.destroy(id);

        commit('REMOVE_CATEGORY', id);
    },
    async getProducts({ commit }) {
        const response = await ProductService.index();

        commit('SET_PRODUCTS', response.data);
    },
    async createProduct({ dispatch }, payload) {
        await ProductService.create(payload);

        await dispatch('getProducts');
    },
    async updateProduct({ commit }, { id, payload }) {
        await ProductService.update(id, payload);

        commit('UPDATE_PRODUCT', { id, value: payload });
    },
    async deleteProduct({ commit }, id) {
        await ProductService.destroy(id);

        commit('REMOVE_PRODUCT', id);
    },
};

export const getters = {
    staff: (state) => {
        return state.staff;
    },
    tables: (state) => {
        return state.tables;
    },
    categories: (state) => {
        return state.categories;
    },
    createdCategories: (state) => {
        return state.categories.filter(category => category.cafe_id);
    },
    products: (state) => {
        return state.products;
    },
};