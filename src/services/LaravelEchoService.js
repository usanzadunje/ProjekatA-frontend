/* Laravel Echo & Pusher imports */
import Echo          from 'laravel-echo';
import { apiClient } from '@/services/API'; // Importing configured axios instance for API calls (that is allowed by CORS)

window.Pusher = require('pusher-js');

export default {
    Echo: new Echo({
        broadcaster: 'pusher',
        key: '16d320316f70d998a209',
        cluster: 'eu',
        encrypted: true,
        /* Authorizer needed so it uses configured axios instance for authorization */
        authorizer: (channel) => {
            return {
                authorize: (socketId, callback) => {
                    apiClient.post('/broadcasting/auth', {
                        socket_id: socketId,
                        channel_name: channel.name,
                    })
                             .then(response => {
                                 callback(false, response.data);
                             })
                             .catch(error => {
                                 callback(true, error);
                             });
                },
            };
        },
    }),
};