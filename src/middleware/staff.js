export default function staff({ next, store }) {
    const homeRoute = { name: "home" };

    if(store.getters["auth/isStaff"]) {
        next();
    }else {
        next(homeRoute);
    }
}