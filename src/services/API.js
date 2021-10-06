import axios from "axios";
import store from '@/store';

// Creating axios instance for routes that are api protected
export const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_URL + "/api",
    // baseURL: "http://192.168.1.203:8200/api",
});

/*
    Add a request interceptor to add authentication token on each request
*/
apiClient.interceptors.request.use(async function(config) {
    let token = store.getters['auth/token'];
    const localization = store.getters['user/localization'];

    if(!token) {
        token = await store.dispatch('auth/getToken');
    }

    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Localization'] = localization.value;

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