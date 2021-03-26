export default function staff({ next, store }) {
    const homeRoute = { name: "home" };
    const loginRoute = { name: "login" };

    if(store.getters["auth/loggedIn"]) {
        if(store.getters["auth/isStaff"]) {
            next();
        }else {
            next(homeRoute);
        }
    }else {
        next(loginRoute);
    }
}