import router from "@/router";

export default function redirectIfAuthenticated({ next, store }) {
    const homeRoute = { name: "home" };

    if(store.getters["auth/loggedIn"] && router.currentRoute.name !== "login") {
        next(homeRoute);
    }else {
        next();
    }
}