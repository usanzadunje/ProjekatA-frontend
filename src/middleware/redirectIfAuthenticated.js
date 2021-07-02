export default function redirectIfAuthenticated({ next, store }) {
    const homeRoute = { name: "home" };

    if(store.getters["auth/loggedIn"]) {
        next(homeRoute);
    }else {
        next();
    }
}