export default async function redirectIfAuthenticated({ from, next, store, router }) {
    if(store.getters["auth/loggedIn"]) {
        router.replace(from);
    }else {
        next();
    }
}