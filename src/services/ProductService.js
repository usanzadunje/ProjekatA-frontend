import * as API from "@/services/API";

export default {
    index(filter = null, offset = null, limit = null) {
        return API.apiClient.get(
            `/owner/place/menu/product/place`,
            {
                params: {
                    filter,
                    offset,
                    limit,
                },
            },
        );
    },
    indexByCategory(placeId, categoryId, offset = null, limit = null) {
        return API.apiClient.get(
            `/places/${placeId}/category/${categoryId}/products`,
            {
                params: {
                    offset,
                    limit,
                },
            },
        );
    },
    show(id) {
        return API.apiClient.get(`/owner/place/menu/product/${id}`);
    },
    create(payload) {
        return API.apiClient.post(`/owner/place/menu/product`, payload);
    },
    update(id, payload) {
        return API.apiClient.put(`/owner/place/menu/product/${id}`, payload);
    },
    destroy(id) {
        return API.apiClient.delete(`/owner/place/menu/product/${id}`);
    },
    images(id) {
        return API.apiClient.get(`/places/product/${id}/images`);
    },
    uploadImages(productId, payload) {
        return API.apiClient.post(`/owner/menu/product/${productId}/images`, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};