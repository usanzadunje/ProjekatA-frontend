import { createRouter, createWebHistory } from '@ionic/vue-router';

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'Home',
        component: () => import(/* webpackChunkName: 'Login'*/ '../views/Login'),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
