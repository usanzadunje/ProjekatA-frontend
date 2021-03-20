import { createRouter, createWebHistory } from '@ionic/vue-router';
import store                              from '../store/index';
import auth                               from "../middleware/auth";
import verified                           from "../middleware/verified";
import redirectIfAuthenticated            from "../middleware/redirectIfAuthenticated";
import middlewarePipeline                 from "./middlewarePipeline";

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import(/* webpackChunkName: "Home" */ "../views/Home"),
    },
    /* START USER ROUTES */
    {
        path: "/dashboard",
        name: "dashboard",
        meta: { middleware: [auth] },
        component: () =>
            import(/* webpackChunkName: "Dashboard" */ "../views/Dashboard"),
    },
    // {
    //     path: "/user",
    //     name: "user",
    //     meta: { requiresAuth: true },
    //     component: () => import(/* webpackChunkName: "user" */ "../views/User"),
    // },
    // {
    //     path: "/users",
    //     name: "users",
    //     meta: { requiresAuth: true },
    //     component: () => import(/* webpackChunkName: "users" */ "../views/Users"),
    //     beforeEnter: (to, from, next) => {
    //         if (store.getters["auth/isAdmin"]) next();
    //         else next(false);
    //     },
    // },
    /* END USER ROUTES */
    /* START AUTH ROUTES */
    /* Responsible for showing verification notice view */
    {
        path: "/email/verify",
        name: "verificationNotice",
        meta: { middleware: [auth] },
        component: () =>
            import(/* webpackChunkName: "EmailVerificationNotice" */ "../views/EmailVerificationNotice"),
    },
    {
        path: "/login",
        name: "login",
        meta: { middleware: [redirectIfAuthenticated] },
        component: () => import(/* webpackChunkName: "Login" */ "../views/Login"),
    },
    {
        path: "/register",
        name: "register",
        meta: { middleware: [redirectIfAuthenticated] },
        component: () =>
            import(/* webpackChunkName: "Register" */ "../views/Register"),
    },
    /* Responsible for showing form for resetting password and sending POST request to backend */
    {
        path: "/reset-password",
        name: "resetPassword",
        component: () =>
            import(/* webpackChunkName: "ResetPassword" */ "../views/ResetPassword"),
    },
    {
        path: "/forgot-password",
        name: "forgotPassword",
        component: () =>
            import(
                /* webpackChunkName: "ForgotPassword" */ "../views/ForgotPassword"
                ),
    },
    {
        path: "/testEmailVerification",
        name: "testEmailVerification",
        meta: { middleware: [auth, verified] },
        component: () =>
            import(/* webpackChunkName: "Test" */ "../views/Test"),
    },
    /* END AUTH ROUTES */
    /* START CAFE ROUTES */
    {
        path: "/cafes",
        name: "cafes",
        component: () =>
            import(/* webpackChunkName: "Cafe" */ "../views/Cafe"),
    },
    /* END CAFE ROUTES */
    /* START TABLE ROUTES */
    {
        path: "/tables",
        name: "table",
        component: () =>
            import(/* webpackChunkName: "Table" */ "../views/Table"),
    },
    /* END TABLE ROUTES */
    {
        path: "/404",
        name: "notFound",
        component: () =>
            import(/* webpackChunkName: "NotFound" */ "../views/404"),
    },
    /* Responsible for handling routes that do not exist */
    {
        path: "/:catchAll(.*)",
        redirect: { name: 'notFound' },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if(savedPosition) {
            return savedPosition;
        }else {
            return { x: 0, y: 0 };
        }
    },
});

router.beforeEach((to, from, next) => {
    const middleware = to.meta.middleware;
    const context = { to, from, next, store };

    if(!middleware) {
        return next();
    }

    middleware[0]({
        ...context,
        next: middlewarePipeline(context, middleware, 1),
    });
});


export default router;
