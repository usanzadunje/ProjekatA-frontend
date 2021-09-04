export default async function staff({ next, store, router }) {
    if(store.getters["auth/isOwner"]) {
        next();
    }else if(store.getters["auth/isStaff"]) {
        router.replace({ name: "staff.dashboard" });
    }else {
        router.replace({ name: "home" });
    }
}