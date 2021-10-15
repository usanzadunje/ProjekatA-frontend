import OwnerService from '@/services/OwnerService';

import { calculatePxFromPercent, removeClonedTableElements } from '@/utils/helpers';
import CategoryService                                       from '@/services/CategoryService';
import ProductService                                        from '@/services/ProductService';
import CafeService                                           from '@/services/CafeService';

const fontSize = getComputedStyle(document.documentElement).fontSize;

export const namespaced = true;

export const state = {
    place: {},
    staff: [],
    tables: [],
    categories: [],
    products: [],
};

export const mutations = {
    /* PLACE */
    SET_PLACE_INFO(state, value) {
        Object.keys(value).forEach(key => {
            state.place[key] = value[key];
        });
    },
    SET_PLACE_IMAGE_TYPE(state, { id, type }) {
        state.place.images.forEach(img => {
            img[type] = img.id === id;
        });
    },

    /* STAFF */
    SET_STAFF_MEMBERS(state, value) {
        state.staff = value;
    },
    CREATE_STAFF(state, value) {
        state.staff.push(value);
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

    /* TABLES */
    SET_TABLES(state, value) {
        state.tables = value;
    },
    CREATE_TABLE(state, value) {
        state.tables.push(value);
    },
    SET_ALL_TABLES_LEFT_POSITION(state, dropzoneWidth) {
        state.tables.forEach(table => {
            table.position.left = calculatePxFromPercent(table.position.left, dropzoneWidth);
        });
    },
    UPDATE_TABLE(state, value) {
        let existingTable = state.tables.find(table => table.id === value.id);

        if(existingTable) {
            existingTable.position = value.position;
            existingTable.dirty = value.dirty;
        }else {
            state.tables.push(value);
        }
    },
    CLEAN_DIRTY_TABLES(state) {
        state.tables.map(table => {
            if(table.dirty) {
                table.dirty = false;
            }
        });
    },
    REMOVE_CLONED_TABLES(state) {
        state.tables = state.tables.filter(table => !table.clone);
    },

    /* CATEGORIES */
    SET_CATEGORIES(state, value) {
        state.categories = value;
    },
    CREATE_CATEGORY(state, value) {
        state.categories.push(value);
    },
    UPDATE_CATEGORY(state, { id, value }) {
        let category = state.categories.find(category => category.id === id);

        category.name = value;
    },
    REMOVE_CATEGORY(state, id) {
        state.categories = state.categories.filter(category => category.id !== id);
    },

    /* PRODUCTS */
    SET_PRODUCTS(state, value) {
        state.products = value;
    },
    LOAD_MORE_PRODUCTS(state, value) {
        state.products = state.products.concat(value);
    },
    CREATE_PRODUCT(state, value) {
        state.products.unshift(value);
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
    SET_NEW_PRODUCT_IMAGE_AS_MAIN(state, { productId, image }) {
        let product = state.products.find(prod => prod.id === productId);
        product.images[0] = image;
    },
    REMOVE_PRODUCT_MAIN_IMAGE(state, productId) {
        let product = state.products.find(prod => prod.id === productId);

        product.images = [];
    },
};

export const actions = {
    /* PLACE */
    async getPlaceInfo({ commit, rootGetters }) {
        const response = await CafeService.show(rootGetters['auth/authUser'].cafe);

        commit('SET_PLACE_INFO', response.data);
        commit('staff/SET_AVAILABILITY_RATIO', response.data?.availability_ratio ?? '0/0', { root: true });
    },
    async updatePlaceInfo({ commit }, place) {
        await OwnerService.updatePlace(place);

        commit('SET_PLACE_INFO', place);
    },
    async setPlaceImageType({ commit }, value) {
        if(value.type === 'is_main') {
            await OwnerService.setImageAsMain(value.id);
        }
        if(value.type === 'is_logo') {
            await OwnerService.setImageAsLogo(value.id);
        }

        if(!value.product) {
            commit('SET_PLACE_IMAGE_TYPE', value);
        }
    },
    async uploadPlaceImages({ state, commit }, value) {
        const response = await OwnerService.uploadPlaceImages(value);

        const place = {
            images: state.place.images.concat(response.data),
        };

        commit('SET_PLACE_INFO', place);
    },

    /* STAFF */
    async getStaffInfo({ commit }) {
        const response = await OwnerService.allStaff();

        commit('SET_STAFF_MEMBERS', response.data);
    },
    async createStaff({ commit }, user) {
        const response = await OwnerService.createStaff(user);

        commit("CREATE_STAFF", response.data);
    },
    async updateStaff({ commit }, { staffId, user }) {
        await OwnerService.updateStaff(staffId, user);

        commit('UPDATE_STAFF_MEMBER', { staffId, user });
    },
    async deleteStaff({ commit }, staffId) {
        await OwnerService.deleteStaff(staffId);

        commit('REMOVE_STAFF_MEMBER', staffId);
    },

    /* TABLES */
    async getTables({ commit, rootGetters }) {
        const response = await OwnerService.allTables();

        commit('SET_TABLES', response.data);

        removeClonedTableElements();

        commit(
            'SET_ALL_TABLES_LEFT_POSITION',
            rootGetters['global/width'] - ((2.25 * parseFloat(fontSize) + 4)),
        );
    },
    async updateTables({ getters, rootGetters, commit }) {
        const dropzoneWidth = rootGetters['global/width'] - ((2.25 * parseFloat(fontSize) + 4));
        const dirtyTables = getters.tables.filter(table => table.dirty);

        const response = await OwnerService.updateTables(dirtyTables);


        commit('REMOVE_CLONED_TABLES');
        commit('CLEAN_DIRTY_TABLES');
        removeClonedTableElements();
        response.data.forEach(table => {
            table.position.left = calculatePxFromPercent(table.position.left, dropzoneWidth);

            commit('CREATE_TABLE', table);
        });
    },

    /* CATEGORIES */
    async getCategories({ commit }) {
        const response = await CategoryService.index();

        commit('SET_CATEGORIES', response.data);
    },
    async createCategory({ commit }, value) {
        const payload = {
            category: value,
        };

        const response = await CategoryService.create(payload);

        commit('CREATE_CATEGORY', response.data);
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

    /* PRODUCTS */
    async getProducts(
        { commit },
        {
            filter = null,
            offset = 0,
            limit = 15,
            load = false,
        },
    ) {
        const response = await ProductService.index(null, filter, offset, limit);

        if(load) {
            commit('LOAD_MORE_PRODUCTS', response.data);
        }else {
            commit('SET_PRODUCTS', response.data);
        }

        // Returning false so infinite scroll can be disabled in components
        // When there is no more data or backend returned less data than required
        // which means there is no more data to be returned
        if(!response.data || response.data.length < limit) {
            return true;
        }
    },
    async createProduct({ commit }, payload) {
        const response = await ProductService.create(payload);

        commit('CREATE_PRODUCT', response.data);
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
    place: (state) => {
        return state.place;
    },
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