export default async function placeMembers({ next, store, router }) {
    if(store.getters["auth/isStaff"] || store.getters["auth/isOwner"] || store.getters["auth/authUser"].id === 1) {
        next();
    }else {
        router.replace({ name: "home" });
    }
}