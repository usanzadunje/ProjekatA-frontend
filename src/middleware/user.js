export default async function user({ next, store, router }) {
    if(store.getters["auth/isStaff"] || store.getters["auth/isOwner"]) {
        router.replace({ name: 'staff.dashboard' });
    }else {
        next();
    }
}