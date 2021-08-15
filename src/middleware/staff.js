export default async function staff({ next, store, router }) {
    if(!store.getters["auth/isStaff"]) {
        router.replace({ name: "home" });
    }else {
        next();
    }
}