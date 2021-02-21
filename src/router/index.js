import { createRouter, createWebHistory } from '@ionic/vue-router';
import store                              from '../store/index';
import auth                               from "../middleware/auth";
import middlewarePipeline                 from "./middlewarePipeline";

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import(/* webpackChunkName: "Home" */ "../views/Home"),
    },
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
    {
        path: "/login",
        name: "login",
        component: () => import(/* webpackChunkName: "Login" */ "../views/Login"),
    },
    {
        path: "/register",
        name: "register",
        component: () =>
            import(/* webpackChunkName: "Register" */ "../views/Register"),
    },
    {
        path: "/cafes",
        name: "cafe",
        component: () =>
            import(/* webpackChunkName: "Cafe" */ "../views/Cafe"),
    },
    // {
    //     path: "/reset-password",
    //     name: "ResetPassword",
    //     component: () =>
    //         import(/* webpackChunkName: "reset-password" */ "../views/ResetPassword"),
    // },
    // {
    //     path: "/forgot-password",
    //     name: "ForgotPassword",
    //     component: () =>
    //         import(
    //             /* webpackChunkName: "forgot-password" */ "../views/ForgotPassword"
    //             ),
    // },
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
        store.dispatch("auth/getAuthUser").then(() => {
        });
        return next();
    }

    middleware[0]({
        ...context,
        next: middlewarePipeline(context, middleware, 1),
    });
});


export default router;
