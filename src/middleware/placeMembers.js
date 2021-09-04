export default async function placeMembers({ next, store, router }) {
    if(store.getters["auth/isStaff"] || store.getters["auth/isOwner"]) {
        next();
    }else {
        router.replace({ name: "home" });
    }
}