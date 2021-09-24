import { createRouter, createWebHistory } from '@ionic/vue-router';

import store                   from '@/store/index';

/* Middleware imports */
import middlewarePipeline      from "./middlewarePipeline";
import auth                    from "@/middleware/auth";
import redirectIfAuthenticated from "@/middleware/redirectIfAuthenticated";
import placeMembers            from "@/middleware/placeMembers";
import user                    from '@/middleware/user';
import owner                   from '@/middleware/owner';

/* Layouts */
import UserLayout              from '@/views/user/layouts/UserLayout';
import StaffLayout             from '@/views/staff/layouts/StaffLayout';
import OwnerPlaceLayout        from '@/views/staff/layouts/OwnerPlaceLayout';

const routes = [
    /* =============================================
        Start unprotected routes from staff
    ============================================= */
    {
        path: "/login",
        name: "login",
        meta: { middleware: [redirectIfAuthenticated] },
        component: () => import(/* webpackChunkName: "Login" */ "@/views/auth/Login"),
    },
    {
        path: "/test",
        name: "test",
        component: () => import(/* webpackChunkName: "Test" */ "@/views/Test"),
    },
    {
        path: "/register",
        name: "register",
        meta: { middleware: [redirectIfAuthenticated] },
        component: () =>
            import(/* webpackChunkName: "Register" */ "@/views/auth/Register"),
    },
    {
        path: "/onboadring",
        name: "onboarding",
        meta: { middleware: [auth, user] },
        component: () => import(/* webpackChunkName: "Onboarding" */ "@/views/user/Onboarding"),
    },
    // {
    //     /* Responsible for showing verification notice view */
    //     path: "/email/verify",
    //     name: "email.notice",
    //     meta: { middleware: [auth] },
    //     component: () =>
    //         import(/* webpackChunkName: "EmailVerificationNotice" */ "../views/auth/EmailVerificationNotice"),
    // },

    // {
    //     /* Responsible for showing form for resetting password and sending POST request to backend */
    //     path: "/reset-password",
    //     name: "password.reset",
    //     component: () =>
    //         import(/* webpackChunkName: "ResetPassword" */ "../views/auth/ResetPassword"),
    // },
    // {
    //     path: "/forgot-password",
    //     name: "password.forgot",
    //     component: () =>
    //         import(
    //             /* webpackChunkName: "ForgotPassword" */ "../views/auth/ForgotPassword"
    //             ),
    // },
    /* =============================================
        End unprotected routes from staff
    ============================================= */
    {
        /* =============================================
            Start routes protected from staff
        ============================================= */

        path: '/',
        component: UserLayout,
        meta: { middleware: [user] },
        redirect: "/home",
        children: [
            {
                path: "home",
                name: "home",
                meta: { middleware: [] },
                component: () => import(/* webpackChunkName: "Home" */ "@/views/user/Home"),
            },
            {
                path: "cafes/:id",
                name: "cafe",
                meta: { middleware: [] },
                component: () =>
                    import(/* webpackChunkName: "Place" */ "@/views/user/Cafe"),
            },
            {
                path: "search",
                name: "search",
                meta: { middleware: [] },
                component: () => import(/* webpackChunkName: "Search" */ "@/views/user/Search"),
                props: true,
            },
            {
                path: "dashboard",
                name: "dashboard",
                meta: { middleware: [auth] },
                component: () => import(/* webpackChunkName: "Dashboard" */ "@/views/user/Dashboard"),
            },
            {
                path: "settings",
                name: "settings",
                meta: { middleware: [auth] },
                component: () => import(/* webpackChunkName: "Settings" */ "@/views/user/Settings"),
            },
            {
                path: "edit",
                name: "edit",
                meta: { middleware: [auth] },
                component: () => import(/* webpackChunkName: "Edit" */ "@/views/user/Edit"),
            },
        ],
    },
    /* =============================================
        End routes protected from staff
    ============================================= */

    /* =============================================
        Start routes protected from end-users
    ============================================= */

    {
        path: "/staff",
        component: StaffLayout,
        meta: { middleware: [auth, placeMembers] },
        redirect: "/staff/dashboard",
        children: [
            {
                path: "dashboard",
                name: "staff.dashboard",
                meta: { middleware: [] },
                component: () => import(/* webpackChunkName: "StaffDashboard" */ "@/views/staff/Dashboard"),
            },
            {
                path: "settings",
                name: "staff.settings",
                meta: { middleware: [] },
                component: () =>
                    import(/* webpackChunkName: "StaffEdit" */ "@/views/staff/Edit"),
            },
            {
                path: "/owner/staff",
                name: "owner.staff",
                meta: { middleware: [owner] },
                component: () =>
                    import(/* webpackChunkName: "OwnerStaffInfo" */ "@/views/staff/owner/StaffInfo"),
            },
            {
                path: "/owner/place",
                component: OwnerPlaceLayout,
                name: "owner.place",
                meta: { middleware: [owner] },
                redirect: '/owner/place/info',
                children: [
                    {
                        path: "info",
                        name: "owner.place.info",
                        component: () => import(/* webpackChunkName: "PlaceInfo" */ "@/views/staff/owner/place/PlaceInfo"),
                    },
                    {
                        path: "tables",
                        name: "owner.place.tables",
                        component: () => import(/* webpackChunkName: "PlaceTables" */ "@/views/staff/owner/place/PlaceTables"),
                    },
                    {
                        path: "menu",
                        name: "owner.place.menu",
                        component: () => import(/* webpackChunkName: "PlaceMenu" */ "@/views/staff/owner/place/PlaceMenu"),
                    },
                ],
            },
        ],
    },
    /* =============================================
        End routes protected from end-users
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
    let middleware = to.meta?.middleware;
    if(to.matched?.length > 1) {
        middleware = [
            ...middleware,
            ...to.matched[0]?.meta?.middleware,
        ];
    }
    const context = { to, from, next, store, router };

    if(!middleware) {
        return next();
    }

    middleware[0]({
        ...context,
        next: middlewarePipeline(context, middleware, 1),
    });
});


export default router;
