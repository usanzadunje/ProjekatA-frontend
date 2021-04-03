import { createRouter, createWebHistory } from '@ionic/vue-router';
import store                              from '@/store/index';

/* Middleware imports */
import middlewarePipeline                 from "./middlewarePipeline";
import auth                               from "@/middleware/auth";
import verified                           from "@/middleware/verified";
import redirectIfAuthenticated            from "@/middleware/redirectIfAuthenticated";
import staff                              from "@/middleware/staff";
import redirectIfStaff                    from '@/middleware/redirectIfStaff';

/* Staff imports views */
import Staff                              from '@/views/staff/Staff';

/* End user imports views*/
import UserLayout                         from '@/views/user/UserLayout';


const routes = [
    /* =============================================
        Start unprotected routes from staff
    ============================================= */
    {
        path: "/test",
        name: "test",
        component: () => import(/* webpackChunkName: "Test" */ "../views/user/Onboarding"),
    },
    {
        path: "/login",
        name: "login",
        meta: { middleware: [redirectIfAuthenticated] },
        component: () => import(/* webpackChunkName: "Login" */ "../views/auth/Login"),
    },
    {
        path: "/register",
        name: "register",
        meta: { middleware: [redirectIfAuthenticated] },
        component: () =>
            import(/* webpackChunkName: "Register" */ "../views/auth/Register"),
    },
    {
        /* Responsible for showing verification notice view */
        path: "/email/verify",
        name: "email.notice",
        meta: { middleware: [auth] },
        component: () =>
            import(/* webpackChunkName: "EmailVerificationNotice" */ "../views/auth/EmailVerificationNotice"),
    },

    {
        /* Responsible for showing form for resetting password and sending POST request to backend */
        path: "/reset-password",
        name: "password.reset",
        component: () =>
            import(/* webpackChunkName: "ResetPassword" */ "../views/auth/ResetPassword"),
    },
    {
        path: "/forgot-password",
        name: "password.forgot",
        component: () =>
            import(
                /* webpackChunkName: "ForgotPassword" */ "../views/auth/ForgotPassword"
                ),
    },
    {
        path: "/testEmailVerification",
        name: "testEmailVerification",
        meta: { middleware: [auth, verified] },
        component: () =>
            import(/* webpackChunkName: "Test" */ "../views/user/Test"),
    },
    /* =============================================
        End unprotected routes from staff
    ============================================= */
    {
        /* =============================================
            Start routes protected from staff
        ============================================= */
        path: '/',
        meta: { middleware: [redirectIfStaff] },
        component: UserLayout,
        children: [
            {
                path: "/",
                name: "home",
                component: () => import(/* webpackChunkName: "Home" */ "../views/user/Home"),
            },
            /* START USER ROUTES */
            {
                path: "/dashboard",
                name: "dashboard",
                meta: { middleware: [auth] },
                component: () =>
                    import(/* webpackChunkName: "Dashboard" */ "../views/user/Dashboard"),
            },
            {
                path: "/user/edit",
                name: "user.edit",
                meta: { middleware: [auth] },
                component: () => import(/* webpackChunkName: "Edit" */ "../views/user/Edit"),
            },

            /* END USER ROUTES */

            /* START CAFE ROUTES */
            {
                path: "/cafes",
                name: "cafes",
                component: () =>
                    import(/* webpackChunkName: "Cafe" */ "../views/user/Cafe"),
            },
            /* END CAFE ROUTES */
            /* START TABLE ROUTES */
            {
                path: "/tables",
                name: "table",
                component: () =>
                    import(/* webpackChunkName: "Table" */ "../views/user/Table"),
            },
            /* END TABLE ROUTES */
        ],
    },
    /* =============================================
        End routes protected from staff
    ============================================= */

    /* =============================================
        Start routes protected from end-user
    ============================================= */
    {
        path: "/staff",
        component: Staff,
        meta: { middleware: [auth, staff] },
        children: [
            {
                path: "tables",
                name: "staff.tables",
                component: () =>
                    import(/* webpackChunkName: "TableStaff" */ "../views/staff/Tables"),
            },
            {
                path: "home",
                name: "staff.home",
                component: () =>
                    import(/* webpackChunkName: "HomeStaff" */ "../views/staff/Home"),
            },
        ],
    },
    /* =============================================
        Start routes protected from end-user
    ============================================= */

    /* =============================================
        Start error routes
    ============================================= */
    {
        path: "/404",
        name: "notFound",
        component: () =>
            import(/* webpackChunkName: "NotFound" */ "../views/errors/404"),
    },
    {
        /* Responsible for handling routes that do not exist */
        path: "/:catchAll(.*)",
        redirect: { name: 'notFound' },
    },
    /* =============================================
        End error routes
    ============================================= */
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


// App.addListener('appUrlOpen', function (data) {
//     // Example url: https://beerswift.app/tabs/tabs2
//     // slug = /tabs/tabs2
//     const slug = data.url.split('.app').pop();
//
//     // We only push to the route if there is a slug present
//     if (slug) {
//         router.push({
//             path: slug,
//         });
//     }
// });


export default router;
