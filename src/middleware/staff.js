export default function staff({ next, store }) {
    const homeRoute = { name: "home" };

    if(!store.getters["auth/authUser"].cafe_id) {
        next(homeRoute);
    }else {
        next();
    }
}