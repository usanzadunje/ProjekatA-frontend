import * as API from "../services/API";

export default {
    index(placeId = null) {
        return API.apiClient.get(`/owner/menu/product/place/${placeId ?? ''}`);
    },
    show(id) {
        return API.apiClient.get(`/owner/menu/product/${id}`);
    },
    create(payload) {
        return API.apiClient.post(`/owner/menu/product`, payload);
    },
    update(id, payload) {
        return API.apiClient.put(`/owner/menu/product/${id}`, payload);
    },
    destroy(id) {
        return API.apiClient.delete(`/owner/menu/product/${id}`);
    },
    images(id) {
        return API.apiClient.get(`/cafes/product/${id}/images`);
    },
    uploadImages(productId, payload) {
        return API.apiClient.post(`/owner/product/${productId}/images/upload`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};