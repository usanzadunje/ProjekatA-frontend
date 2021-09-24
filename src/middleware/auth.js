/* Middleware that handles whether users is logged in or not and lets them continue to another route accordingly */

export default async function auth({ next, store, router }) {
    if(!store.getters["auth/loggedIn"]) {
        router.replace({ name: "login" });
    }else {
        return next();
    }
}