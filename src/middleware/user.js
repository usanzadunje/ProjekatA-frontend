export default async function user({ next, store, router }) {
    if(store.getters["auth/isStaff"] || store.getters["auth/isOwner"]) {
        if(store.getters["auth/authUser"]?.id === 1) {
            next();
        }else {
            router.replace({ name: 'staff.dashboard' });
        }
    }else {
        next();
    }
}