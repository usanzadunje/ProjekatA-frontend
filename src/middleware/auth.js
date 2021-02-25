/* Middleware that handles whether user is logged in or not and lets them continue to another route accordingly */

export default function auth({ to, next, store }) {
    const loginRoute = { path: "/login", query: { redirect: to.fullPath } };

    if(!store.getters["auth/authUser"]) {
        store.dispatch("auth/getAuthUser").then(() => {
            if(!store.getters["auth/authUser"]) next(loginRoute);
            else next();
        });
    }else {
        next();
    }
}