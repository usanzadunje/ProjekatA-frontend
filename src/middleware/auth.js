/* Middleware that handles whether user is logged in or not and lets them continue to another route accordingly */

export default function auth({ next, store }) {
    const loginRoute = { name: "login" };

    if(!store.getters["auth/loggedIn"]) {
        store.dispatch("auth/getAuthUser")
             .then(() => {
                 if(!store.getters["auth/authUser"]) next(loginRoute);
                 else next();
             }).catch(() => next(loginRoute));
    }else {
        next();
    }
}