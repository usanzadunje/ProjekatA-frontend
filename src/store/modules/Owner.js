import OwnerService from '@/services/OwnerService';

import CategoryService from '@/services/CategoryService';
import ProductService  from '@/services/ProductService';
import PlaceService    from '@/services/PlaceService';
import TableService    from '@/services/TableService';

import { deviceWidth } from '@/composables/useDevice';

import { calculatePxFromPercent, removeClonedTableElements } from '@/utils/helpers';
import TableSectionService                                   from '@/services/TableSectionService';

const fontSize = getComputedStyle(document.documentElement).fontSize;

export const namespaced = true;

export const state = {
    place: {},
    staff: [],
    activeStaff: [],
    tables: [],
    tableSections: [],
    categories: [],
    products: [],
};

export const mutations = {
    /* PLACE */
    SET_PLACE_INFO(state, payload) {
        Object.keys(payload).forEach(key => {
            state.place[key] = payload[key];
        });
    },
    SET_PLACE_IMAGE_TYPE(state, { id, type }) {
        state.place.images.forEach(img => {
            img[type] = img.id === id;
        });
    },

    /* STAFF */
    SET_STAFF_MEMBERS(state, payload) {
        state.staff = payload;
    },
    LOAD_MORE_STAFF_MEMBERS(state, payload) {
        state.staff = state.staff.concat(payload);
    },
    SET_ACTIVE_STAFF_MEMBERS(state, payload) {
        state.activeStaff = payload;
    },
    CREATE_STAFF(state, payload) {
        state.staff.push(payload);
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
    SET_TABLES(state, payload) {
        state.tables = payload;
    },
    CREATE_TABLE(state, payload) {
        state.tables.push(payload);
    },
    SET_ALL_TABLES_LEFT_POSITION(state) {
        state.tables.forEach(table => {
            table.position.left = calculatePxFromPercent(
                table.position.left,
                deviceWidth.value - ((2.25 * parseFloat(fontSize) + 4)),
            );
        });
    },
    UPDATE_TABLE_POSITION(state, payload) {
        let existingTable = state.tables.find(table => table.id === payload.id);

        if(existingTable) {
            existingTable.position = payload.position;
            existingTable.dirty = payload.dirty;
        }else {
            state.tables.push(payload);
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
    TOGGLE_TABLE_AVAILABILITY(state, { tableId, value = null }) {
        let table = state.tables.find(table => {
            return table.id === Number(tableId);
        });

        let empty = false;

        if(value == null) {
            empty = table.empty ? 0 : 1;
        }else {
            empty = value ? 1 : 0;
        }
        table.empty = empty;
    },
    UPDATE_TABLE(state, { tableId, payload }) {
        let table = state.tables.find(table => table.id === tableId);

        Object.keys(payload).forEach(key => {
            table[key] = payload[key];
        });
    },
    REMOVE_TABLE(state, payload) {
        state.tables = state.tables.filter(table => table.id !== payload);
    },

    /* TABLE SECTIONS */
    CREATE_TABLE_SECTION(state, payload) {
        state.tableSections.push(payload);
    },
    SET_TABLE_SECTIONS(state, payload) {
        state.tableSections = payload;
    },
    UPDATE_TABLE_SECTION(state, { sectionId, payload }) {
        let section = state.tableSections.find(section => section.id === sectionId);

        Object.keys(payload).forEach(key => {
            section[key] = payload[key];
        });
    },
    REMOVE_TABLE_SECTION(state, payload) {
        state.tableSections = state.tableSections.filter(section => section.id !== payload);
    },

    /* CATEGORIES */
    SET_CATEGORIES(state, payload) {
        state.categories = payload;
    },
    CREATE_CATEGORY(state, payload) {
        state.categories.push(payload);
    },
    UPDATE_CATEGORY(state, { id, category }) {
        let existingCategory = state.categories.find(category => category.id === id);

        Object.keys(category).forEach(key => {
            existingCategory[key] = category[key];
        });
    },
    REMOVE_CATEGORY(state, id) {
        state.categories = state.categories.filter(category => category.id !== id);
    },

    /* PRODUCTS */
    SET_PRODUCTS(state, payload) {
        state.products = payload;
    },
    LOAD_MORE_PRODUCTS(state, payload) {
        state.products = state.products.concat(payload);
    },
    CREATE_PRODUCT(state, payload) {
        state.products.unshift(payload);
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

    PURGE_DATA(state) {
        state.place = {};
        state.staff = [];
        state.tables = [];
        state.categories = [];
        state.products = [];
    },
};

export const actions = {
    /* PLACE */
    async getPlaceInfo({ commit, rootGetters }) {
        const response = await PlaceService.show(rootGetters['auth/authUser'].place);

        commit('SET_PLACE_INFO', response.data);
    },
    async updatePlaceInfo({ commit }, place) {
        await OwnerService.updatePlace(place);

        commit('SET_PLACE_INFO', place);
    },
    async setPlaceImageType({ commit }, payload) {
        if(payload.type === 'is_main') {
            await OwnerService.setImageAsMain(payload.id);
        }
        if(payload.type === 'is_logo') {
            await OwnerService.setImageAsLogo(payload.id);
        }

        if(!payload.product) {
            commit('SET_PLACE_IMAGE_TYPE', payload);
        }
    },
    async uploadPlaceImages({ state, commit }, payload) {
        const response = await OwnerService.uploadPlaceImages(payload);

        const place = {
            images: state.place.images.concat(response.data),
        };

        commit('SET_PLACE_INFO', place);
    },

    /* STAFF */
    async getStaffInfo(
        { commit },
        {
            offset = 0,
            limit = 10,
            load = false,
        },
    ) {
        const response = await OwnerService.allStaff(offset, limit);

        if(load) {
            commit('LOAD_MORE_STAFF_MEMBERS', response.data);
        }else {
            commit('SET_STAFF_MEMBERS', response.data);
        }

        // Returning true so infinite scroll can be disabled in components
        // When there is no more data or backend returned less data than required
        // which means there is no more data to be returned
        if(!response.data || response.data.length < limit) {
            return true;
        }
    },
    async getActiveStaffInfo({ commit }) {
        const response = await OwnerService.activeStaff();

        commit('SET_ACTIVE_STAFF_MEMBERS', response.data);
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
    async getTables({ commit }) {
        const response = await OwnerService.allTables();

        commit('SET_TABLES', response.data.tables);
        commit('SET_TABLE_SECTIONS', response.data.sections);

        removeClonedTableElements();

        commit('SET_ALL_TABLES_LEFT_POSITION');
    },
    async updateTables({ getters, commit }, payload) {
        const dropzoneWidth = deviceWidth.value - ((2.25 * parseFloat(fontSize) + 4));
        const dirtyTables = getters.tables.filter(table => table.dirty);

        dirtyTables.forEach(table => {
            if(table.clone) {
                if(!payload) {
                    payload = {
                        id: 1,
                    };
                }
                commit('UPDATE_TABLE', {
                    tableId: table.id,
                    payload: {
                        'section': payload,
                    },
                });
            }
        });

        const response = await TableService.updateMany(dirtyTables);

        commit('REMOVE_CLONED_TABLES');
        commit('CLEAN_DIRTY_TABLES');

        removeClonedTableElements();

        response.data.forEach(table => {
            table.position.left = calculatePxFromPercent(table.position.left, dropzoneWidth);

            commit('CREATE_TABLE', table);
        });
    },
    async updateTable({ commit }, { tableId, payload }) {
        await TableService.update(tableId, payload);

        commit('UPDATE_TABLE', { tableId, payload });
    },
    async deleteTable({ commit }, tableId) {
        await TableService.destroy(tableId);

        commit('REMOVE_TABLE', tableId);
    },

    /* TABLE SECTIONS */
    async createTableSection({ commit }, payload) {
        const response = await TableSectionService.store(payload);

        commit('CREATE_TABLE_SECTION', response.data);
    },
    async updateTableSection({ commit }, { sectionId, payload }) {
        await TableSectionService.update(sectionId, payload);

        commit('UPDATE_TABLE_SECTION', { sectionId, payload });
    },
    async deleteTableSection({ commit }, sectionId) {
        await TableSectionService.destroy(sectionId);

        commit('REMOVE_TABLE_SECTION', sectionId);
    },

    /* CATEGORIES */
    async getCategories({ commit }) {
        const response = await CategoryService.index();

        commit('SET_CATEGORIES', response.data);
    },
    async createCategory({ commit }, payload) {
        const response = await CategoryService.create(payload);

        commit('CREATE_CATEGORY', response.data);
    },
    async updateCategory({ commit }, { id, category }) {
        await CategoryService.update(id, category);

        commit('UPDATE_CATEGORY', { id, category });
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
        const response = await ProductService.index(filter, offset, limit);

        if(load) {
            commit('LOAD_MORE_PRODUCTS', response.data);
        }else {
            commit('SET_PRODUCTS', response.data);
        }

        // Returning true so infinite scroll can be disabled in components
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
    activeStaff: (state) => {
        return state.activeStaff;
    },
    tables: (state) => {
        return state.tables;
    },
    tableSections: (state) => {
        return state.tableSections;
    },
    categories: (state) => {
        return state.categories;
    },
    createdCategories: (state) => {
        return state.categories.filter(category => category.place_id);
    },
    products: (state) => {
        return state.products;
    },
};