import axios          from "axios";
import { useStorage } from '@/services/StorageService';

// Creating axios instance for routes that are api protected
export const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_URL + "/api",
});

/*
    Add a request interceptor to add authentication token on each request
*/
apiClient.interceptors.request.use(async function(config) {
    const { get } = useStorage();
    const token = await get('projekata_token');
    if(!token) {
        delete config.headers.authorization;
    }else {
        config.headers.authorization = `Bearer ${token}`;
    }

    return config;
}, function(error) {
    // Do something with request error
    return Promise.reject(error);
});


/*
    Add a response interceptor to hanndle errors
*/
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    function(error) {
        return Promise.reject(error);
    },
);