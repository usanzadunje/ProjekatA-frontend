export default async function staff({ next, store, router }) {
    if(store.getters["auth/isOwner"] || store.getters["auth/authUser"].id === 1) {
        next();
    }else if(store.getters["auth/isStaff"]) {
        router.replace({ name: "staff.dashboard" });
    }else {
        router.replace({ name: "home" });
    }
}